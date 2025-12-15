const { createClerkClient } = require("@clerk/express");
const dotenv = require("dotenv");

dotenv.config();

const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
});

module.exports.clerkClient = clerkClient;
