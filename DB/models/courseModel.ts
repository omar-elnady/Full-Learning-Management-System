import mongoose, { Schema, model } from "mongoose";

// 🟡 Comment Schema
const commentSchema = new Schema({
  commentId: { type: String, required: true },
  userId: { type: String, required: true },
  text: { type: String, required: true },
  timestamp: { type: String, required: true },
}, { _id: false });

// 🟡 Chapter Schema
const chapterSchema = new Schema({
  chapterId: { type: String, required: true },
  type: { type: String, enum: ["Text", "Quiz", "Video"], required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  comments: [commentSchema],
  video: { type: String },
}, { _id: false });

// 🟡 Section Schema
const sectionSchema = new Schema({
  sectionId: { type: String, required: true },
  sectionTitle: { type: String, required: true },
  sectionDescription: { type: String },
  chapters: [chapterSchema],
}, { _id: false });

// 🟡 Enrollment Schema
const enrollmentSchema = new Schema({
  userId: { type: String, required: true },
}, { _id: false });

// 🟢 Main Course Schema
const courseSchema = new Schema({
  courseId: { type: String, required: true, unique: true }, // optional: use MongoDB default _id
  teacherId: { type: String, required: true },
  teacherName: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String },
  category: { type: String, required: true },
  image: { type: String },
  price: { type: Number },
  level: {
    type: String,
    enum: ["Beginner", "Intermediate", "Advanced"],
    required: true,
  },
  status: {
    type: String,
    enum: ["Draft", "Published"],
    required: true,
  },
  sections: [sectionSchema],
  enrollments: [enrollmentSchema],
}, { timestamps: true });

const CourseModel = model("Course", courseSchema);
export default CourseModel;
