import { mergeSections, calculateOverallProgress } from './../../../utils/utils';
  import { Request, Response } from "express";
  import { getAuth } from "@clerk/express";
  import UserCourseProgressModel from "../../../DB/models/userCourseProgressModel";
  import CourseModel from "../../../DB/models/courseModel";
import mongoose from 'mongoose';

  export const getUserEnrolledCourses = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const { userId } = req.params;
    const auth = getAuth(req);

    if (!auth || auth.userId !== userId) {
      res.status(403).json({ message: "Access denied" });
      return;
    }

    try {
      const enrolledCourses = await UserCourseProgressModel.find({ userId });

      if (!enrolledCourses || enrolledCourses.length === 0) {
         res.status(404).json({ message: "No enrolled courses found" });
         return;
      }

      const courseIds = enrolledCourses.map((item: any) => item.courseId);
        const courses = await CourseModel.find({
        _id: { $in: courseIds },
      });
      res.json({
        message: "Enrolled courses retrieved successfully",
        data: courses,
      });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error retrieving enrolled courses", error });
    }
  };

  export const getUserCourseProgress = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const { userId, courseId } = req.params;

    try {
      const progress = await UserCourseProgressModel.findOne({userId , courseId});
      
      if (!progress) {
        res
          .status(404)
          .json({ message: "Course progress not found for this user" });
        return;
      }
      res.json({
        message: "Course progress retrieved successfully",
        data: progress,
      });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error retrieving user course progress", error });
    }
  };


  export const updateUserCourseProgress = async (
      req: Request,
      res: Response
    ): Promise<void> => {
      const { userId, courseId } = req.params;
      const progressData = req.body;
  
      try {
        let progress = await UserCourseProgressModel.findOne({ userId, courseId });
  
        if (!progress) {
          // If no progress exists, create initial progress
          progress = new UserCourseProgressModel({
            userId,
            courseId,
            enrollmentDate: new Date().toISOString(),
            overallProgress: 0,
            sections: progressData.sections || [],
            lastAccessedTimestamp: new Date().toISOString(),
          });
        } else {
     
          const checkProgressArray = Array.isArray(progress.sections)
  ? progress.sections
  : [];

const mergedSections = mergeSections(
  checkProgressArray.map(section => section.toObject ? section.toObject() : section),
  progressData.sections || []
);

progress.sections = new mongoose.Types.DocumentArray(mergedSections);
progress.lastAccessedTimestamp = new Date().toISOString();
progress.overallProgress = calculateOverallProgress(progress.sections);



        }
  
        await progress.save();
  
        res.json({
          message: "Course progress updated successfully",
          data: progress,
        });
      } catch (error) {
        console.error("Error updating progress:", error);
        res.status(500).json({
          message: "Error updating user course progress",
          error,
        });
      }
    };