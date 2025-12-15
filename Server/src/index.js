import express from "express";
import bootstarp from "./bootstrap.js";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const port = process.env.PORT || 5000;

bootstarp(app, express);

app.listen(port, () => {
  console.log(`Server is running on Port ${port}`);
});
