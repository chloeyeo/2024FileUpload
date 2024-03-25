const express = require("express");
dotenv = require("dotenv").config();
const app = express();
const mongoose = require("mongoose");
const db_url = process.env.MONGODB_URL;
const { userRouter } = require("./routes/userRouter");

app.use(express.json());

const server = async function () {
  try {
    await mongoose.connect(db_url);
    mongoose.set("debug", true);
    app.use("/user", userRouter);
    app.listen(3000);
    ("db connected");
  } catch (error) {
    console.error(error.message);
  }
};

server();
