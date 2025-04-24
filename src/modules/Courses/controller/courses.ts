import { NextFunction, Request, Response } from "express";
import CourseModel from "../../../../DB/models/courseModel";
import { v4 as uuidv4 } from "uuid";
import { getAuth } from "@clerk/express";
import cloudinary from "../../../utils/cloudinary";


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
          let videoData = {
            secure_url: "",
            public_id: "",
          };

          if (chapter.type === "Video" && chapter.video && typeof chapter.video === 'object') {
            try {
              const result = await cloudinary.uploader.upload(chapter.video, {
                folder: `courses/${courseId}/sections/${sectionIndex}/chapters/${chapterIndex}`,
                resource_type: 'video',
                allowed_formats: ['mp4', 'webm', 'mov'],
              });

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

    await CourseModel.findByIdAndDelete(courseId);
    res.json({ message: "Course deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting course", error });
  }
};

export const getUploadVideoUrl = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { fileName, fileType } = req.body;

  if (!fileName || !fileType) {
    res.status(400).json({ message: "File name and file type are required" });
    return;
  }

  try {
    const uniqueId = uuidv4();
    const s3Key = `videos/${uniqueId}/${fileName}`;
    const s3Params = {
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: s3Key,
      Expires: 60,
      ContentType: fileType,
    };

    const uploadUrl = s3.getSignedUrl("putObject", s3Params);
    const videoUrl = `${process.env.CLOUDFRONT_DOMAIN}/videos/${uniqueId}/${fileName}`;

    res.json({
      message: "Upload URL generated successfully",
      data: {
        uploadUrl,
        videoUrl,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Error generating upload URL", error });
  }
};
