const express = require("express");
dotenv = require("dotenv").config();
const app = express();
const mongoose = require("mongoose");
const db_url = process.env.MONGODB_URL;
const { userRouter } = require("./routes/userRouter");
const { upload } = require("../middleware/imageUpload");

// this lines opens up the file, allowing everyone to access image file
// when they visit url => allow ALL people to see. to filter people
// who can view image file, then we need to introduce authorization.
// app.use(express.static("uploads")); // visit http://localhost:3000/img1.jpg
// inside uploads folder, change uploaded image file name to e.g. abc.jpg
// then now if you visit localhost:3000/uploads/abc.jpg, the image appears on browser
// uploads in express.static("uploads") is the folder name I set to store images
app.use("/uploads", express.static("uploads")); // visit http://localhost:3000/uploads/img1.jpg

// Multer is a node.js middleware for handling multipart/form-data,
// which is primarily used for uploading files.
// Multer will NOT process any form which is not multipart (multipart/form-data).
// const multer = require("multer");

// this means when we use uuid in code below, it will actually be v4
// just like in default:mongoose when we use mongoose it actually uses default
// uuid generates a random string
// const { v4: uuid } = require("uuid");

// const mime = require("mime-types");

/*
Browsers use the MIME type, not the file extension,
to determine how to process a URL */

// dest = destination, where file will be uploaded
// "uploads" or "uploads/" but NOT "/uploads"
// this line automatically creates uploads folder
//01st
//const upload = multer({ dest: "uploads" }); // this is middleware, which we'll exclude later on
// middleware goes to middle param of app.post()

//02st
// const storage = multer.diskStorage({
//   destination: function (req, file, callback) {
//     callback(null, "./uploads");
//   },
//   filename: function (req, file, callback) {
//     //mime.extension(type): get the default extension for a content-type.
//     // if on postman the posted file type is a jpeg, its req.file sent to response body
//     // wiil contain "mimetype": "image/jpeg",
//     // "filename": "4f7018a2-3455-4d84-a8c2-ec3f76d6b999.jpeg"
//     // this is the result of mime.extension(file.mimetype). since
//     // our image file was of type jpeg, the filename was set to
//     // whatever random string uuid() generated, i.e. 4f7018a2-3455-4d84-a8c2-ec3f76d6b999
//     // + "." + file.mimetype which in our case was jpeg since our mimetype is "image/jpeg".
//     // we use uuid() just to make file name unique in case two files have same names
//     // so you can also use Date.now() instead of uuid() to give the same effect

//     callback(null, uuid() + "." + mime.extension(file.mimetype));
//     // callback(
//     //   null,
//     //   Date.now() + file.fieldname + "." + mime.extension(file.mimetype)
//     // ); // same effect as above callback
//   },
// }); // diskStorage is settings; setting file storage name and filter image types, file size, etc.
// // i.e. fileFilter sets/filters WHAT kind of files can be stored in diskStorage.
// const upload = multer({
//   storage,
//   fileFilter: function (req, file, cb) {
//     // cb (callback) is a function (name)
//     //01
//     // if (file.mimetype === "image/png" || file.mimetype === "image/jpeg") {
//     //   cb(null, true);
//     // } else {
//     //   cb(new Error("invalid file type: only png and jpeg allowed"), false);
//     // }

//     //02
//     // "image/jpeg" and "image/png", NOT "jpeg" or "png"!
//     // const imgType = ["image/jpeg", "image/png"];
//     // if (imgType.includes(file.mimetype)) {
//     if (["image/jpeg", "image/png"].includes(file.mimetype)) {
//       cb(null, true);
//     } else {
//       cb(new Error("invalid file type: only png and jpeg allowed"), false);
//     }
//   },
//   limits: {
//     fileSize: 1024 * 1024 * 3, // only <= 3 mega bytes file can be uploaded
//     // 1024*1024 is 1 mega byte (1 MB) file
//     // 1 MB is 1024x1024 bytes (File sizes are measured in Bytes (B))
//   },
// }); // same as storage: storage (if two names of both key and val are same can just use one name)

// // this lines opens up the file, allowing everyone to access image file
// // when they visit url => allow ALL people to see. to filter people
// // who can view image file, then we need to introduce authorization.
// // app.use(express.static("uploads")); // visit http://localhost:3000/img1.jpg
// // inside uploads folder, change uploaded image file name to e.g. abc.jpg
// // then now if you visit localhost:3000/uploads/abc.jpg, the image appears on browser
// app.use("/uploads", express.static("uploads")); // visit http://localhost:3000/uploads/img1.jpg

const server = async function () {
  try {
    await mongoose.connect(db_url);
    console.log("db connected");
    mongoose.set("debug", true);
    app.use(express.json());
    /* "image" inside upload single is the name of input element
    inside a form element(input inside form)
    <form action="<route>", method="post", enctype="multipart/form-data">
    <input type="file" name="<file_name>" /> </form>
    <input type="file" name="image" />
    i.e. file_name will be replaced with "image"
    // so upload.single() will upload this input from form
    // in postman: post request, body -> form-data (not raw!)
    // bc we're uploading from a form
    // key: image (in postman under form-data)
    // (comes from file_name we set for input element name="image")
    // key: image and set as file (not text), then upload any image from
    // local folder then as soon as you send post request,
    // inside the uploads folder the image appears that we just
    // uploaded from postman. 
    Now if we go to http://localhost:3000/uploads/img1.jpg
    it says Cannot GET /uploads/img1.jpg
    so to open file, we need to get express static and app.use middleware
    add this line app.use(express.static("uploads"));
    then now if we visit http://localhost:3000/img1.jpg */
    app.post("/upload", upload.single("image"), async function (req, res) {
      try {
        console.log("req.file.originalname:", req.file.originalname);
        console.log("req.file.filename:", req.file.filename);
        /* log:
        {
            "fieldname": "image",
            "originalname": "img1.jpg",
            "encoding": "7bit",
            "mimetype": "image/jpeg",
            "destination": "uploads",
            "filename": "81e8084c046360e362b06cdee16e314d",
            "path": "uploads\\81e8084c046360e362b06cdee16e314d",
            "size": 31227
        } */
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
