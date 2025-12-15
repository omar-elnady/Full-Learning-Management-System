import { Schema, model } from "mongoose";

const transactionSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    transactionId: {
      type: String,
      required: true,
      unique: true,
    },
    dateTime: {
      type: String,
      required: true,
    },
    courseId: {
      type: String,
      required: true,
      index: true,
    },
    paymentProvider: {
      type: String,
      enum: ["stripe"],
      required: true,
    },
    amount: {
      type: Number,
    },
  },
  {
    timestamps: true,
    strict: false,
  }
);

const TransactionModel = model("Transaction", transactionSchema);
export default TransactionModel;
