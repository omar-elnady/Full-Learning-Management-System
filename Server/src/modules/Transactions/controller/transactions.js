const Stripe = require("stripe");
const dotenv = require("dotenv");
const Course = require("../../../DB/models/courseModel");
const Transaction = require("../../../DB/models/transactionModel");
const UserCourseProgress = require("../../../DB/models/userCourseProgressModel");

dotenv.config();

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error(
    "Missing STRIPE_SECRET_KEY is required but not found in env variable"
  );
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-08-16",
});

const listTransactions = async (req, res) => {
  const { userId } = req.query;

  try {
    const transactions = userId
      ? await Transaction.find({ userId })
      : await Transaction.find();

    res.json({
      message: "Transactions Retrieved Successfully",
      data: transactions,
    });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving transactions", error });
  }
};

const createStripePaymentIntent = async (req, res) => {
  let { amount } = req.body;

  if (!amount || amount <= 0) {
    amount = 50;
  }

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: "never",
      },
    });

    res.json({
      message: "Stripe Payment Intent Created Successfully",
      data: {
        clientSecret: paymentIntent.client_secret,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating stripe payment intent", error });
  }
};

const createTransaction = async (req, res) => {
  const { userId, courseId, transactionId, amount, paymentProvider } = req.body;

  try {
    // 1. Get course info
    const course = await Course.findById(courseId);
    if (!course) {
      res.status(404).json({ message: "Course not found" });
      return;
    }

    // 2. Create transaction
    const newTransaction = await Transaction.create({
      dateTime: new Date().toISOString(),
      userId,
      courseId,
      transactionId,
      amount,
      paymentProvider,
    });

    // 3. Create initial course progress
    const initialProgress = await UserCourseProgress.create({
      userId,
      courseId,
      enrollmentDate: new Date().toISOString(),
      overallProgress: 0,
      sections: course.sections.map((section) => ({
        sectionId: section._id || section.sectionId,
        chapters: section.chapters.map((chapter) => ({
          chapterId: chapter._id || chapter.chapterId,
          completed: false,
        })),
      })),
      lastAccessedTimestamp: new Date().toISOString(),
    });

    // 4. Add user to course enrollments
    course.enrollments.push({ userId });
    await course.save();

    res.json({
      message: "Purchased Course successfully",
      data: {
        transaction: newTransaction,
        courseProgress: initialProgress,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Error creating transaction and enrollment",
      error,
    });
  }
};

module.exports = {
  listTransactions,
  createStripePaymentIntent,
  createTransaction,
};
