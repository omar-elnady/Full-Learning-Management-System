import {
  useCreateCourseMutation,
  useDeleteeCourseMutation,
  useGetCoursesQuery,
} from "@/state/api";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/router";
import React, { useMemo, useState } from "react";

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
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  
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
  return <div></div>;
};

export default CoursesTeacherPage;
