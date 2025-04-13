import bodyParser from 'body-parser';
import cors from 'cors';
import helmet from 'helmet'
import morgan from 'morgan';
import { Express } from 'express';
/* Routers Import */
import CoursesRouter from './modules/Courses/Courses.router'
import UserSettingsRouter from './modules/UserClerk/userClerk.router'
import { clerkMiddleware, requireAuth } from '@clerk/express';
import TransactionRouter from './modules/Transactions/transactions.router'

const bootstarp = (app: Express, express: typeof import("express")) => {
    app.use(express.json());
    app.use(helmet());
    app.use(
        helmet.crossOriginEmbedderPolicy({
            policy: "credentialless"
        })
    ); app.use(morgan("common"));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(cors())
    app.use(clerkMiddleware())
    app.use("/api/courses", CoursesRouter)
    app.use("/api/userSettings", requireAuth(), UserSettingsRouter)
    app.use("/api/transactions", requireAuth(), TransactionRouter)
}

export default bootstarp;