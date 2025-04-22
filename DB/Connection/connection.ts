import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
// Connection with MongoDB
const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    console.error("MONGO_URI is not defined in the environment variables");
    process.exit(1);
  }
  try {
    await mongoose.connect(mongoUri)
    console.log("MongoDB connected successfully");
  } catch (err) {
    console.error("Failed to connect to MongoDB:", err);
    process.exit(1);
  }
};

export default connectDB;
