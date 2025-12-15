const { Schema, model } = require("mongoose");

const chapterProgressSchema = new Schema({
  chapterId: {
    type: String,
    required: true,
  },
  completed: {
    type: Boolean,
    required: true,
  },
});

const sectionProgressSchema = new Schema({
  sectionId: {
    type: String,
    required: true,
  },
  chapters: {
    type: [chapterProgressSchema],
    required: true,
  },
});

const userCourseProgressSchema = new Schema(
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

const userCourseProgressModel = model(
  "UserCourseProgress",
  userCourseProgressSchema
);
module.exports = userCourseProgressModel;
