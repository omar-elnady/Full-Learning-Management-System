"use client";
import Header from "@/components/Header";
import Loading from "@/components/Loading";
import TeacherCourseCard from "@/components/TeacherCourseCard";
import Toolbar from "@/components/Toolbar";
import { Button } from "@/components/ui/button";
import {
  useCreateCourseMutation,
  useDeleteeCourseMutation,
  useGetCoursesQuery,
} from "@/state/api";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import React, { useMemo, useState } from "react";
import { toast } from "sonner";


const CoursesTeacherPage = () => {
  const router = useRouter();
  const { user } = useUser();
  const {
    data: courses,
    isLoading,
    isError,
  } = useGetCoursesQuery({ category: "all" });
  const [createCourse] = useCreateCourseMutation();
  const [deleteCourse] = useDeleteeCourseMutation();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredCourses = useMemo(() => {
    if (!courses) return [];
    return courses.filter((course) => {
      const matchesSearch = course.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === "all" || course.category === selectedCategory;
      return matchesCategory && matchesSearch;
    });
  }, [courses, searchTerm, selectedCategory]);

  const handleCreateCourse = async () => {
    if (!user) {
      toast.error("You must be logged in to create a course");
      return;
    }

    const result = await createCourse({
      teacherId: user.id,
      teacherName: user.fullName || "Unknown Teacher",
    }).unwrap();
    router.push(`/dashboard/teacher/courses/${result._id}`, {
      scroll: false,
    });
    toast.success("Course created successfully");

  };

  const handleEdit = (course: Course) => {
    router.push(`/dashboard/teacher/courses/${course._id}`, {
      scroll: false,
    });
  };

  const handleDelete = async (course: Course) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      await deleteCourse(course._id).unwrap();
    }
  };

  if (isLoading) return <Loading />;
  if (isError || !courses) return <div>Error loading courses.</div>;

  return (
    <div className="teacher-courses">
      <Header
        title="Courses"
        subtitle="Browser your courses"
        rightElement={
          <Button
            onClick={() => handleCreateCourse()}
            className="teacher-courses__header"
          >
            Create Course
          </Button>
        }
      />
      <Toolbar
        onSearch={setSearchTerm}
        onCategoryChange={setSelectedCategory}
      />
      <div className="teacher-courses__grid">
        {filteredCourses?.map((course) => (
          <TeacherCourseCard
            key={course?._id}
            course={course}
            onEdit={handleEdit}
            onDelete={handleDelete}
            isOwner={user?.id === course.teacherId}

          />
        ))}
      </div>
    </div>
  );
};

export default CoursesTeacherPage;