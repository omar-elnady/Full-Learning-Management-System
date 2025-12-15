import { ChapterFormData, chapterSchema } from "@/app/lib/schemas";
import { CustomFormField } from "@/components/CustomFormField";
import CustomModal from "@/components/CustomModal";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { validateVideo } from "@/lib/utils";
import { addChapter, closeChapterModal, editChapter } from "@/state";
import { useAppDispatch, useAppSelector } from "@/state/redux";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

const ChapterModal = () => {
  const dispatch = useAppDispatch();
  const {
    isChapterModalOpen,
    selectedSectionIndex,
    selectedChapterIndex,
    sections,
  } = useAppSelector((state) => state.global.courseEditor);

  const chapter: Chapter | undefined =
    selectedSectionIndex !== null && selectedChapterIndex !== null
      ? sections[selectedSectionIndex].chapters[selectedChapterIndex]
      : undefined;

  const methods = useForm<ChapterFormData>({
    resolver: zodResolver(chapterSchema),
    defaultValues: {
      title: "",
      content: "",
      video: undefined,
    },
  });

  useEffect(() => {
    if (chapter) {
      methods.reset({
        title: chapter.title,
        content: chapter.content,
        video: undefined,
      });
    } else {
      methods.reset({
        title: "",
        content: "",
        video: undefined,
      });
    }
  }, [chapter, methods]);

  const onClose = () => {
    dispatch(closeChapterModal());
  };

  const onSubmit = (data: ChapterFormData) => {
    if (selectedSectionIndex === null) return;

    if (data.video instanceof File) {
      if (!validateVideo(data.video)) {
        return;
      }
    }

    const newChapter: Chapter = {
      chapterId: chapter?.chapterId || uuidv4(),
      title: data.title.trim(),
      content: data.content.trim(),
      type: data.video ? "Video" : "Text",
      video: data.video || undefined,
      comments: chapter?.comments || []
    };

    if (selectedChapterIndex === null) {
      dispatch(
        addChapter({
          sectionIndex: selectedSectionIndex,
          chapter: newChapter,
        })
      );
    } else {
      dispatch(
        editChapter({
          sectionIndex: selectedSectionIndex,
          chapterIndex: selectedChapterIndex,
          chapter: newChapter,
        })
      );
    }
    toast.success(
      `Chapter added/updated successfully but you need to save the course to apply the changes`
    );
    onClose();
  };

  return (
    <CustomModal isOpen={isChapterModalOpen} onClose={onClose}>
      <div className="flex flex-col w-full">
        <div className="flex justify-between items-center mb-4 border-b border-border pb-4">
          <h2 className="text-2xl font-bold text-foreground">Add/Edit Chapter</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <Form {...methods}>
          <form
            onSubmit={methods.handleSubmit(onSubmit)}
            className="flex flex-col space-y-4"
          >
            <CustomFormField
              name="title"
              label="Chapter Title"
              placeholder="Write chapter title here"
            />

            <CustomFormField
              name="content"
              label="Chapter Content"
              type="textarea"
              placeholder="Write chapter content here"
            />

            <FormField
              control={methods.control}
              name="video"
              render={({ field: { onChange, value } }) => (
                <FormItem>
                  <FormLabel className="text-foreground text-sm font-medium">
                    Chapter Video
                  </FormLabel>
                  <FormControl>
                    <div>
                      <Input
                        type="file"
                        accept="video/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            onChange(file);
                          }
                        }}
                        className="border-input bg-background py-2 cursor-pointer text-foreground file:text-foreground"
                      />
                      {typeof value === "string" && value && (
                        <div className="my-2 text-sm text-muted-foreground">
                          Current video: {(value as string)?.split("/").pop()}
                        </div>
                      )}
                      {value instanceof File && (
                        <div className="my-2 text-sm text-muted-foreground">
                          Selected file: {value.name}
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage className="text-destructive" />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-4 mt-6">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" className="bg-primary hover:bg-primary/90">
                Save
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </CustomModal>
  );
};

export default ChapterModal;