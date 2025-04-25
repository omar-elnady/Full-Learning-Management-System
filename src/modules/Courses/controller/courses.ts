import { NextFunction, Request, Response } from "express";
import CourseModel from "../../../../DB/models/courseModel";
import { v4 as uuidv4 } from "uuid";
import { getAuth } from "@clerk/express";
import cloudinary from "../../../utils/cloudinary";
import fs from "fs";


export const listCourses = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { category } = req.query;
  try {
    const courses =
      category && category !== "all"
        ? await CourseModel.find({ category })
        : await CourseModel.find();
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
    if (!courseId) {
      res.status(400).json({ message: "Course ID is required" });
      return;
    }
    const course = await CourseModel.findById(courseId);
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
      res.status(400).json({ message: "Teacher ID and Name are required" });
      return;
    }

    const newCourse = new CourseModel({
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
    res.status(500).json({ message: "Error creating course", error });
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
  const files = req.files as Express.Multer.File[];


  
  try {
    const course = await CourseModel.findById(courseId);
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
          error: "Price must be a valid number",
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

      updateData.sections = await Promise.all(sectionsData.map(async (section: any, sectionIndex: number) => ({
        ...section,
        sectionId: section.sectionId || uuidv4(),
        chapters: await Promise.all(section.chapters.map(async (chapter: any, chapterIndex: number) => {

          const videoFile = files?.find(
            (file) => file.fieldname === `video_${chapter.chapterId}`
          );

          let videoData = chapter.video;

          if ( videoFile) {
            try {
              console.log(`Uploading video for chapter ${chapter.title}...`);

              const result = await cloudinary.uploader.upload(videoFile.path, {
                folder: `courses/${courseId}/sections/${sectionIndex}/chapters/${chapterIndex}`,
                resource_type: 'video',
                allowed_formats: ['mp4', 'webm', 'mov'],
              });
              console.log("Video upload result:", result);
              fs.unlinkSync(videoFile.path);

              chapter.video = {
                secure_url: result.secure_url,
                public_id: result.public_id
              };
            } catch (error) {
              console.error(`Error uploading video for chapter ${chapter.title}:`, error);
              throw new Error(`Failed to upload video for chapter ${chapter.title}`);
            }
          }


          return {
            ...chapter,
            chapterId: chapter.chapterId || uuidv4(),

          };
        })),
      })));
    }

    await CourseModel.findByIdAndUpdate(courseId, updateData, { new: true });
    const updatedCourse = await CourseModel.findById(courseId);

    res.json({ message: "Course updated successfully", data: updatedCourse });
  } catch (error) {
    res.status(500).json({ message: "Error updating course", error });
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
    const course = await CourseModel.findById(courseId);
    if (!course) {
      res.status(404).json({ message: "Course not found" });
      return;
    }

    if (course.teacherId !== userId) {
      res.status(403).json({ message: "Not authorized to delete this course" });
      return;
    }
    for (const section of course.sections) {
      for (const chapter of section.chapters) {
        if (chapter.type === "Video" && chapter.video?.public_id) {
          try {
            await cloudinary.uploader.destroy(chapter.video.public_id, {
              resource_type: 'video'
            });
          } catch (error) {
            console.error(`Error deleting video for chapter ${chapter.title}:`, error);
          }
        }
      }
    }
    await CourseModel.findByIdAndDelete(courseId);
    res.json({ message: "Course deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting course", error });
  }
};

