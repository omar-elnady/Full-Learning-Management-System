"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.8,
      when: "beforeChildren",
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: {
    scale: 0.8,
    opacity: 0,
  },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
    },
  },
};




export default function HeroSection() {
  const router = useRouter();
  const handleCourseClick = () => {
    router.push(`/search`, {
      scroll: false,
    });
  };

  return (
    <div className="relative  min-h-screen flex items-center justify-center px-4">
      <div className="relative z-10 text-center max-w-4xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {/* Badge */}
          <motion.div variants={itemVariants}>
            <div className=" inline-flex items-center gap-3 px-6 py-3 rounded-full dark:bg-white/10 bg-gray-700  backdrop-blur-md border border-white/20">
              <div className="w-2 h-2 rounded-full bg-green-400" />
              <span className="text-sm font-semibold text-green-400">
                🚀 Join 10,000+ Successful Developers
              </span>
              <div className="w-2 h-2 rounded-full bg-green-400" />
            </div>
          </motion.div>

          {/* Main Heading */}
          <motion.div variants={itemVariants}>
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="dark:text-white text-black">Master In-Demand</span>
              <br />
              <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">
                Tech Skills
              </span>
            </h1>
          </motion.div>

          {/* Subheading */}
          <motion.div variants={itemVariants}>
            <p className="text-lg sm:text-xl md:text-2xl dark:text-gray-300 text-gray-800 mb-10 leading-relaxed max-w-3xl mx-auto">
              Transform your career with industry-relevant courses in
              <br className="hidden sm:block" />
              <span className="text-blue-600 font-semibold">
                Web Development, AI, Data Science, and Cloud Computing
              </span>
            </p>
          </motion.div>

          <motion.div variants={itemVariants}>
            <div className="flex flex-col sm:flex-row gap-6 items-center justify-center mb-12">
              <Button
                size="lg"
                onClick={handleCourseClick}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl px-8 py-4 sm:px-12 sm:py-6 text-base sm:text-lg font-bold shadow-2xl shadow-blue-500/30 hover:shadow-blue-500/50 transition-all duration-300 hover:scale-105 border border-blue-400/30 w-full sm:w-auto"
              >
                🚀 Explore Courses
              </Button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
