const express = require("express");
dotenv = require("dotenv").config();
const app = express();
const mongoose = require("mongoose");
const db_url = process.env.MONGODB_URL;
const { userRouter } = require("./routes/userRouter");
const { upload } = require("../middleware/imageUpload");

app.use("/uploads", express.static("uploads"));

const server = async function () {
  try {
    await mongoose.connect(db_url);
    console.log("db connected");
    mongoose.set("debug", true);
    app.use(express.json());
    app.post("/upload", upload.single("image"), async function (req, res) {
      try {
        console.log("req.file.originalname:", req.file.originalname);
        console.log("req.file.filename:", req.file.filename);
        return res.send(req.file);
      } catch (error) {
        return res.status(500).send({ error: error.message });
      }
    });
    app.use("/user", userRouter);
    app.listen(3000);
  } catch (error) {
    console.error(error.message);
  }
};

server();
