import express, { Express } from "express"
import bootstarp from "./bootstrap";
import dotenv from 'dotenv';
import mongoose from "mongoose";
import { createClerkClient } from '@clerk/express';




dotenv.config();
const app: Express = express()
const port = process.env.port || 5000;

export const clerkClient = createClerkClient({
    secretKey: process.env.CLERK_SECRET_KEY,
})


bootstarp(app, express)




app.listen(port, () => {
    console.log(`Server is running on Port ${port}`);

})

export default app;

