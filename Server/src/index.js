const express = require("express");
const bootstarp = require("./bootstrap");
const dotenv = require("dotenv");

dotenv.config();
const app = express();
const port = process.env.PORT || 5000;

bootstarp(app, express);

app.listen(port, () => {
  console.log(`Server is running on Port ${port}`);
});
