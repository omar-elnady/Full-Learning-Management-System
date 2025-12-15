import { Router } from "express";
import * as TransactionsController from "./controller/transactions.js";
const router = Router();

router.get("/", TransactionsController.listTransactions);
router.post(
  "/stripe/payment-intent",
  TransactionsController.createStripePaymentIntent
);
router.post("/", TransactionsController.createTransaction);

export default router;
