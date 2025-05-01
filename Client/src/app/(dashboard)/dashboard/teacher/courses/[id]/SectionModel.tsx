import { SectionFormData, sectionSchema } from "@/app/lib/schemas";
import { CustomFormField } from "@/components/CustomFormField";
import CustomModal from "@/components/CustomModal";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { addSection, closeSectionModal, editSection } from "@/state";
import { useAppDispatch, useAppSelector } from "@/state/redux";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

const SectionModal = () => {
  const dispatch = useAppDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isSectionModalOpen, selectedSectionIndex, sections } = useAppSelector(
    (state) => state.global.courseEditor
  );

  const section = selectedSectionIndex !== null ? sections[selectedSectionIndex] : null;
  const isEditing = selectedSectionIndex !== null;

  const methods = useForm<SectionFormData>({
    resolver: zodResolver(sectionSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  const { reset, formState: { isDirty } } = methods;

  useEffect(() => {
    if (section) {
      reset({
        title: section.sectionTitle,
        description: section.sectionDescription,
      });
    } else {
      reset({
        title: "",
        description: "",
      });
    }
  }, [section, reset]);

  const handleClose = () => {
    if (isDirty) {
      if (window.confirm("You have unsaved changes. Are you sure you want to close?")) {
        reset();
        dispatch(closeSectionModal());
      }
    } else {
      dispatch(closeSectionModal());
    }
  };

  const onSubmit = async (data: SectionFormData) => {
    try {
      setIsSubmitting(true);

      const newSection: Section = {
        sectionId: section?.sectionId || uuidv4(),
        sectionTitle: data.title.trim(),
        sectionDescription: data.description?.trim(),
        chapters: section?.chapters || [],
      };

      if (!isEditing) {
        dispatch(addSection(newSection));
        toast.success("Section added successfully");
      } else {
        dispatch(
          editSection({
            index: selectedSectionIndex,
            section: newSection,
          })
        );
        toast.success("Section updated successfully");
      }

      toast.info("Remember to save the course to apply changes");
      handleClose();
    } catch (error) {
      toast.error("Failed to save section");
      console.error("Section save error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <CustomModal isOpen={isSectionModalOpen} onClose={handleClose}>
      <div className="section-modal">
        <div className="section-modal__header">
          <h2 className="section-modal__title">
            {isEditing ? "Edit Section" : "Add Section"}
          </h2>
          <button 
            onClick={handleClose} 
            className="section-modal__close"
            disabled={isSubmitting}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <Form {...methods}>
          <form
            onSubmit={methods.handleSubmit(onSubmit)}
            className="section-modal__form"
          >
            <CustomFormField
              name="title"
              label="Section Title"
              placeholder="Write section title here"
              disabled={isSubmitting}
            />

            <CustomFormField
              name="description"
              label="Section Description"
              type="textarea"
              placeholder="Write section description here"
              disabled={isSubmitting}
            />

            <div className="section-modal__actions">
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="bg-primary-700"
                disabled={isSubmitting || !isDirty}
              >
                {isSubmitting ? "Saving..." : "Save"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </CustomModal>
  );
};

export default SectionModal;