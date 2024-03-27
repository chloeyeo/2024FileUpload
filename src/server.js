const express = require("express");
dotenv = require("dotenv").config();
const app = express();
const mongoose = require("mongoose");
const db_url = process.env.MONGODB_URL;
// const { userRouter } = require("./routes/userRouter");
const { userRouter } = require("./routes/userRouterNew");
const { imageRouter } = require("./routes/imageRouter");

// Bind application-level middleware to an instance of the app
// object by using the app.use()
// express.static is a built-in middleware function of express that
// serves static assets such as HTML files, images, etc.
// if in browser we go to /uploads route, there will be static files there
// express.static("uploads") will serve images, CSS files,
// and JavaScript files in a directory named "uploads".
// now, you can load the files that are in the "uploads" directory:
// in browser view images when by going to /uploads, such as
// http://localhost:3000/uploads/img2.jpg
// express.static(<directory_name>)
app.use("/uploads", express.static("uploads"));

const server = async function () {
  try {
    await mongoose.connect(db_url);
    console.log("db connected");
    mongoose.set("debug", true);
    app.use(express.json());
    app.use("/user", userRouter);
    app.use("/upload", imageRouter);
    app.listen(3000);
  } catch (error) {
    console.error(error.message);
  }
};

server();
