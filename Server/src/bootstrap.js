import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import connectDB from "./DB/Connection/connection.js";
/* Routers Import */
import CoursesRouter from "./modules/Courses/Courses.router.js";
import UserSettingsRouter from "./modules/UserClerk/userClerk.router.js";
import { clerkMiddleware, requireAuth } from "@clerk/express";
import TransactionRouter from "./modules/Transactions/transactions.router.js";
import userCourseProgressRoute from "./modules/UserCoursesProgress/userCoursesProgress.router.js";

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

export default bootstarp;
