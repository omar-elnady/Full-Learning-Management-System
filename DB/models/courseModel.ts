import mongoose, { Schema, model } from "mongoose";


const commentSchema = new Schema({
  commentId: { type: String, required: true },
  userId: { type: String, required: true },
  text: { type: String, required: true },
  timestamp: { type: String, required: true },
}, { _id: false });


const chapterSchema = new Schema({
  chapterId: { type: String, required: true },
  type: { type: String, enum: ["Text", "Quiz", "Video"], required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  comments: [commentSchema],
  video: { secure_url: String, public_id: String },
}, { _id: false });


const sectionSchema = new Schema({
  sectionId: { type: String, required: true },
  sectionTitle: { type: String, required: true },
  sectionDescription: { type: String },
  chapters: [chapterSchema],
}, { _id: false });


const enrollmentSchema = new Schema({
  userId: { type: String, required: true },
}, { _id: false });

// 🟢 Main Course Schema
const courseSchema = new Schema({
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
