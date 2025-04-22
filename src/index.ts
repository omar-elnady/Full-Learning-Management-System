import express, { Express } from "express"
import bootstarp from "./bootstrap";
import dotenv from 'dotenv';
import mongoose from "mongoose";
import { createClerkClient } from '@clerk/express';
import serverless from 'serverless-http';
import seed from '../DB/Connection/connection'



dotenv.config();
const app = express()
const port = process.env.port || 5000;

export const clerkClient = createClerkClient({
    secretKey: process.env.CLERK_SECRET_KEY,
})


bootstarp(app, express)


const isProduction = process.env.Node_ENV === "production"
if (!isProduction) {
    mongoose.connect(process.env.MONGO_URI!, {
        dbName: 'LmsCourses', // ✅ حط اسم قاعدة البيانات هنا لو محتاج
    })
    .then(() => {
        console.log("Connected to MongoDB");

        app.listen(port, () => {
            console.log(`Server is running on Port ${port}`);
        });
    })
    .catch((err) => {
        console.error("MongoDB connection error:", err);
    });
}

const serverLessApp = serverless(app);

export const handler = async (event: any, context: any) => {
    if (event.action === "seed") {
        await seed();
        return {
            statusCode: 200,
            body: JSON.stringify({ message: "Database seeded successfully" }),
        };
    } else {
        return serverLessApp(event, context);
    }


}

