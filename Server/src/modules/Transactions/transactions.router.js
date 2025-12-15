const { Router } = require("express");
const TransactionsController = require("./controller/transactions");
const router = Router();

router.get("/", TransactionsController.listTransactions);
router.post(
  "/stripe/payment-intent",
  TransactionsController.createStripePaymentIntent
);
router.post("/", TransactionsController.createTransaction);

module.exports = router;
