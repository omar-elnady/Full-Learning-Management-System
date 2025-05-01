"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const commentSchema = new mongoose_1.Schema({
    commentId: { type: String, required: true },
    userId: { type: String, required: true },
    text: { type: String, required: true },
    timestamp: { type: String, required: true },
}, { _id: false });
const chapterSchema = new mongoose_1.Schema({
    chapterId: { type: String, required: true },
    type: { type: String, enum: ["Text", "Quiz", "Video"], required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    comments: [commentSchema],
    video: { secure_url: String, public_id: String },
}, { _id: false });
const sectionSchema = new mongoose_1.Schema({
    sectionId: { type: String, required: true },
    sectionTitle: { type: String, required: true },
    sectionDescription: { type: String },
    chapters: [chapterSchema],
}, { _id: false });
const enrollmentSchema = new mongoose_1.Schema({
    userId: { type: String, required: true },
}, { _id: false });
// 🟢 Main Course Schema
const courseSchema = new mongoose_1.Schema({
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
const CourseModel = (0, mongoose_1.model)("Course", courseSchema);
exports.default = CourseModel;
