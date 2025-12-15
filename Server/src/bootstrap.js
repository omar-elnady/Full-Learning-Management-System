const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const connectDB = require("./DB/Connection/connection");
/* Routers Import */
const CoursesRouter = require("./modules/Courses/Courses.router");
const UserSettingsRouter = require("./modules/UserClerk/userClerk.router");
const { clerkMiddleware, requireAuth } = require("@clerk/express");
const TransactionRouter = require("./modules/Transactions/transactions.router");
const userCourseProgressRoute = require("./modules/UserCoursesProgress/userCoursesProgress.router");

const bootstarp = (app, express) => {
  connectDB();
  app.use(morgan("common"));
  app.use(cors());
  app.use(helmet());
  app.use(
    helmet.crossOriginEmbedderPolicy({
      policy: "credentialless",
    })
  );
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(clerkMiddleware());
  app.use("/api/courses", CoursesRouter);
  app.use("/api/userSettings", requireAuth(), UserSettingsRouter);
  app.use("/api/transactions", requireAuth(), TransactionRouter);
  app.use("/api/course-progress", requireAuth(), userCourseProgressRoute);
};

module.exports = bootstarp;
