import { NextFunction, Request, Response } from "express";
import CourseModel from "../../../../DB/models/courseModel";
import { v4 as uuidv4 } from "uuid";
import AWS from "aws-sdk";

import { getAuth } from "@clerk/express";
const s3 = new AWS.S3()
export const listCourses = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { category } = req.query;
  try {
    const courses =
      category && category !== "all"
        ? await CourseModel.scan("category").eq(category).exec()
        : await CourseModel.scan().exec();

    res.json({ message: "Done", data: courses });
  } catch (error) {
    res.status(500).json({ message: "Error", error });
  }
};
export const getCourse = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { courseId } = req.params;
  try {
    const course = await CourseModel.get(courseId);
    if (!course) {
      res.status(404).json({ message: "Course not found" });
      return;
    }
    res.json({ message: "Done", data: course });
  } catch (error) {
    res.status(500).json({ message: "Error", error });
  }
};

export const createCourse = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { teacherId, teacherName } = req.body;

    if (!teacherId || !teacherName) {
      res.status(400).json({ message: "Teacher ID and Name are Requaird" });
      return;
    }
    const newCourse = new CourseModel({
      courseId: uuidv4(),
      teacherId,
      teacherName,
      title: "Untitled Course",
      description: "",
      category: "Uncategorized",
      image: "",
      price: 0,
      level: "Beginner",
      status: "Draft",
      sections: [],
      enrollments: [],
    });
    await newCourse.save();
    res.json({ message: "Course created successfully", data: newCourse });
  } catch (error) {
    res.status(500).json({ message: "Error creating course ", error });
  }
};

export const updateCourse = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { courseId } = req.params;
  const updateData = { ...req.body };
  const { userId } = getAuth(req);
  try {
    const course = await CourseModel.get(courseId);
    if (!course) {
      res.status(404).json({ message: "Course not found" });
      return;
    }

    if (course.teacherId !== userId) {
      res.status(403).json({ message: "Not authorized to update this course" });
      return;
    }
    if (updateData.price) {
      const price = parseInt(updateData.price);
      if (isNaN(price)) {
        res.status(400).json({
          message: "Invalid price format",
          error: "Price must be a valid number ",
        });
        return;
      }
      updateData.price = price * 100;
    }
    if (updateData.sections) {
      const sectionsData =
        typeof updateData.sections === "string"
          ? JSON.parse(updateData.sections)
          : updateData.sections;

      updateData.sections = sectionsData.map((section: any, sectionIndex: number) => ({
        ...section,
        sectionId: section.sectionId || uuidv4(),
        chapters: section.chapters.map((chapter: any, chapterIndex: number) => {
          let videoFieldName: string;

          if (typeof chapter.video === "string") {
            videoFieldName = chapter.video;
          } else if (typeof chapter.video === "object" && chapter.video !== null && chapter.video.originalname) {
            videoFieldName = `video-${sectionIndex}-${chapterIndex}`;
          } else {
            throw new Error(`Invalid video format at section ${sectionIndex}, chapter ${chapterIndex}`);
          }

          return {
            ...chapter,
            chapterId: chapter.chapterId || uuidv4(),
            video: videoFieldName,
          };
        }),
      }));
    }
    Object.assign(course, updateData);
    await course.save();
    res.json({ message: "Course updated successfully", data: course });
  } catch (error) {
    res.status(500).json({ message: "Error updated course ", error });
  }
};

export const deleteCourse = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { courseId } = req.params;
  const { userId } = getAuth(req);
  try {
    const { teacherId, teacherName } = req.body;

    const course = await CourseModel.get(courseId);
    if (!course) {
      res.status(404).json({ message: "Course not found" });
      return;
    }
    if (course.teacherId !== userId) {
      res.status(403).json({ message: "Not authorized to update this course" });
      return;
    }
    await CourseModel.delete(courseId);
    res.json({ message: "Course deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting course ", error });
  }
};

export const getUploadVideoUrl = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { fileName, fileType } = req.body;

  if (!fileName || !fileType) {
    res.status(400).json({ message: "File name and file type are required" })
    return;
  }

  try {
    const uniqueId = uuidv4();
    const s3Key = `videos/${uniqueId}/${fileName}`;
    const s3Parmas = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: s3Key,
      Expires: 60,
      ContentType: fileType,
    }
    const uploadUrl = s3.getSignedUrl("putObject", s3Parmas);
    const videoUrl = `${process.env.CLOUDFRONT_DOMAIN}/videos/${uniqueId}/${fileName}`;
    res.json({
      message: "Upload URL generated successfully",
      data: {
        uploadUrl,
        videoUrl,
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Error generating upload URL", error })

  }

}