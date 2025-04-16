import {
  useCreateCourseMutation,
  useDeleteeCourseMutation,
  useGetCoursesQuery,
} from "@/state/api";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/router";
import React, { useState } from "react";

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
  return <div></div>;
};

export default CoursesTeacherPage;
