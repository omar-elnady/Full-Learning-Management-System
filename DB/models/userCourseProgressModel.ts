import mongoose, { Schema, model, Document, Types } from "mongoose";

interface IChapterProgress {
  chapterId: string;
  completed: boolean;
}

interface ISectionProgress {
  sectionId: string;
  chapters: IChapterProgress[];
}

interface IUserCourseProgress extends Document {
  userId: string;
  courseId: string;
  enrollmentDate: string;
  overallProgress: number;
  sections: Types.DocumentArray<ISectionProgress>;
  lastAccessedTimestamp: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const chapterProgressSchema = new Schema<IChapterProgress>({
  chapterId: {
    type: String,
    required: true,
  },
  completed: {
    type: Boolean,
    required: true,
  },
});

const sectionProgressSchema = new Schema<ISectionProgress>({
  sectionId: {
    type: String,
    required: true,
  },
  chapters: {
    type: [chapterProgressSchema],
    required: true,
  },
});

const userCourseProgressSchema = new Schema<IUserCourseProgress>(
  {
    userId: {
      type: String,
      required: true,
    },
    courseId: {
      type: String,
      required: true,
    },
    enrollmentDate: {
      type: String,
      required: true,
    },
    overallProgress: {
      type: Number,
      required: true,
    },
    sections: {
      type: [sectionProgressSchema],
      required: true,
    },
    lastAccessedTimestamp: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const userCourseProgressModel = model<IUserCourseProgress>("UserCourseProgress", userCourseProgressSchema);
export default userCourseProgressModel;