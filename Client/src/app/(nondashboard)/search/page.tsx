"use client";
import Loading from "@/components/Loading";
import {
  useGetCoursesQuery,
  useGetUserEnrolledCoursesQuery,
} from "@/state/api";
import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import SelectedCourse from "./SelectedCourse";
import CourseCardSearch from "@/components/CourseCardSearch";
import { useUser } from "@clerk/nextjs";
const Search = () => {
  const searchParams = useSearchParams();
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const id = searchParams.get("id");
  const { data: courses, isLoading, isError } = useGetCoursesQuery({});
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const { data: enrolledCourses = [] } = useGetUserEnrolledCoursesQuery(
    user?.id ?? "",
    {
      skip: !isLoaded || !user,
    }
  );

  useEffect(() => {
    if (courses)
      if (id) {
        const course = courses.find((c) => c._id === id);
        setSelectedCourse(course || courses[0]);
      } else {
        setSelectedCourse(courses[0]);
      }
  }, [courses, id]);
  if (isLoading) return <Loading />;
  if (isError || !courses) return <div>Failed to fetch courses</div>;

  const handleCourseSelect = (course: Course) => {
    setSelectedCourse(course);
    router.push(`/search?id=${course._id}`, {
      scroll: false,
    });
  };
  const handleEnrollNow = (courseId: string) => {
    user && isLoaded
      ? router.push(`/checkout?step=2&id=${courseId} `, {
          scroll: false,
        })
      : router.push(`/checkout?step=1&id=${courseId}`, {
          scroll: false,
        });
  };
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="search"
    >
      <h1 className="search__title">List of available courses</h1>
      <h2 className="search__subtitle">{courses.length} Courses available</h2>
      <div className="search__content">
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="search__courses-grid"
        >
          {courses.map((course, index) => (
            <CourseCardSearch
              key={course?._id || index}
              isSelected={selectedCourse?._id === course._id}
              course={course}
              onClick={() => handleCourseSelect(course)}
            />
          ))}
        </motion.div>
        {selectedCourse && (
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="search__selected-course"
          >
            <SelectedCourse
              course={selectedCourse}
              enrolledCourses={enrolledCourses}
              handleEnrollNow={handleEnrollNow}
            />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default Search;
