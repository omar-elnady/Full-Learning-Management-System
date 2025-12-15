"use client";
import Loading from "@/components/Loading";
import {
  useGetCoursesQuery,
  useGetUserEnrolledCoursesQuery,
} from "@/state/api";
import { motion, AnimatePresence } from "framer-motion";
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
    if (user && isLoaded) {
      router.push(`/checkout?step=2&id=${courseId}`, {
        scroll: false,
      });
    } else {
      router.push(`/checkout?step=1&id=${courseId}`, {
        scroll: false,
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col bg-background text-foreground h-full mx-auto w-3/4"
    >
      <h1 className="font-normal text-2xl mt-14">List of available courses</h1>
      <h2 className="text-muted-foreground mb-3">{courses.length} Courses available</h2>
      <div className="w-full flex flex-col-reverse lg:flex-row pb-8 pt-2 gap-8">
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="basis-3/5 grid grid-cols-1 xl:grid-cols-2 gap-6 auto-rows-max content-start"
        >
          {courses.map((course, index) => (
            <React.Fragment key={course?._id || index}>
              <CourseCardSearch
                isSelected={selectedCourse?._id === course._id}
                course={course}
                onClick={() => handleCourseSelect(course)}
              />
              <AnimatePresence>
                {selectedCourse?._id === course._id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="lg:hidden w-full border-2 border-primary bg-card overflow-hidden rounded-lg"
                  >
                    <SelectedCourse
                      course={selectedCourse}
                      enrolledCourses={enrolledCourses}
                      handleEnrollNow={handleEnrollNow}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </React.Fragment>
          ))}
        </motion.div>
        {selectedCourse && (
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="hidden lg:block basis-2/5 min-w-[350px] h-fit border-2 border-primary bg-card overflow-hidden rounded-lg"
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
