"use client";

import { motion } from "framer-motion";
import CourseCardSearch from "@/components/CourseCardSearch";
import { useGetCoursesQuery } from "@/state/api";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function FeaturedCourses() {
  const { data: courses, isLoading, isError } = useGetCoursesQuery({});
  const [shouldLoad, setShouldLoad] = useState(false);
  const router = useRouter();


  const handleCourseClick = (courseId: string) => {
    router.push(`/search?id=${courseId}`, {
      scroll: false,
    });
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setShouldLoad(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (!shouldLoad) {
    return (
      <div className="relative pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-pulse">Loading courses...</div>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading)
    return (
      <div className="relative py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-pulse">Loading courses...</div>
          </div>
        </div>
      </div>
    );

  if (isError)
    return (
      <div className="relative pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12 text-red-400">
            Error loading courses
          </div>
        </div>
      </div>
    );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="relative py-20 px-4"
    >
      <div className="max-w-7xl mx-auto">
        <motion.h2
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-5xl font-bold text-center mb-4"
        >
          Featured <span className="text-blue-600">Courses</span>
        </motion.h2>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-xl dark:text-gray-400 text-gray-600 text-center mb-12 max-w-3xl mx-auto"
        >
          From beginner to advanced, in all industries , we have the right
          courses just for you and preparing your entire journey for learning
          and making the most .
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {courses?.slice(0, 8).map((course, index) => (
            <motion.div
              key={course._id}
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ y: -3 }}
            >
              <CourseCardSearch
                course={course}
                onClick={() => handleCourseClick(course._id)}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
