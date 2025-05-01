"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const chapterProgressSchema = new mongoose_1.Schema({
    chapterId: {
        type: String,
        required: true,
    },
    completed: {
        type: Boolean,
        required: true,
    },
});
const sectionProgressSchema = new mongoose_1.Schema({
    sectionId: {
        type: String,
        required: true,
    },
    chapters: {
        type: [chapterProgressSchema],
        required: true,
    },
});
const userCourseProgressSchema = new mongoose_1.Schema({
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
}, {
    timestamps: true,
});
const userCourseProgressModel = (0, mongoose_1.model)("UserCourseProgress", userCourseProgressSchema);
exports.default = userCourseProgressModel;
