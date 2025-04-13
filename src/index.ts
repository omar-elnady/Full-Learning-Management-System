import express, { Express } from "express"
import bootstarp from "./bootstrap";
import dotenv from 'dotenv';
import * as dynamoose from 'dynamoose';
import { createClerkClient } from '@clerk/express';



dotenv.config();
const app = express()
const port = process.env.port || 5000;

export const clerkClient = createClerkClient({
    secretKey: process.env.CLERK_SECRET_KEY,
})


bootstarp(app, express)


const isProduction = process.env.Node_ENV === "production"
if (!isProduction) {
    dynamoose.aws.ddb.local();

    app.listen(port, () => {
        console.log(
            `Server is running on Port ${port} `
        )
    })
}


