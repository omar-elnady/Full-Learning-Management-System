import cors from 'cors';
import helmet from 'helmet'
import morgan from 'morgan';
import { Express } from 'express';
import connectDB from './DB/Connection/connection'
/* Routers Import */
import CoursesRouter from './modules/Courses/Courses.router'
import UserSettingsRouter from './modules/UserClerk/userClerk.router'
import { clerkMiddleware, requireAuth } from '@clerk/express';
import TransactionRouter from './modules/Transactions/transactions.router'
import userCourseProgressRoute from './modules/UserCoursesProgress/userCoursesProgress.router'

const bootstarp = (app: Express, express: typeof import("express")) => {
    connectDB()
    app.use(morgan("common"));
    app.use(cors());                   
app.use(helmet());                  
app.use(
    helmet.crossOriginEmbedderPolicy({
        policy: "credentialless"
    })
);
app.use(express.json());           
app.use(express.urlencoded({ extended: false }));
app.use(clerkMiddleware());    
    app.use("/api/courses", CoursesRouter)
    app.use("/api/userSettings", requireAuth(), UserSettingsRouter)
    app.use("/api/transactions", requireAuth(), TransactionRouter)
    app.use("/api/course-progress", requireAuth(), userCourseProgressRoute);

}

export default bootstarp;