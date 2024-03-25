const multer = require("multer");
const { v4: uuid } = require("uuid");
const mime = require("uuid");

const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "./uploads");
  },
  filename: function (req, file, callback) {
    //mime.extension(type): get the default extension for a content-type.
    // if on postman the posted file type is a jpeg, its req.file sent to response body
    // wiil contain "mimetype": "image/jpeg",
    // "filename": "4f7018a2-3455-4d84-a8c2-ec3f76d6b999.jpeg"
    // this is the result of mime.extension(file.mimetype). since
    // our image file was of type jpeg, the filename was set to
    // whatever random string uuid() generated, i.e. 4f7018a2-3455-4d84-a8c2-ec3f76d6b999
    // + "." + file.mimetype which in our case was jpeg since our mimetype is "image/jpeg".
    // we use uuid() just to make file name unique in case two files have same names
    // so you can also use Date.now() instead of uuid() to give the same effect

    callback(null, uuid() + "." + mime.extension(file.mimetype));
    // callback(
    //   null,
    //   Date.now() + file.fieldname + "." + mime.extension(file.mimetype)
    // ); // same effect as above callback
  },
}); // diskStorage is settings; setting file storage name and filter image types, file size, etc.
// i.e. fileFilter sets/filters WHAT kind of files can be stored in diskStorage.
const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    // cb (callback) is a function (name)
    //01
    // if (file.mimetype === "image/png" || file.mimetype === "image/jpeg") {
    //   cb(null, true);
    // } else {
    //   cb(new Error("invalid file type: only png and jpeg allowed"), false);
    // }

    //02
    // "image/jpeg" and "image/png", NOT "jpeg" or "png"!
    // const imgType = ["image/jpeg", "image/png"];
    // if (imgType.includes(file.mimetype)) {
    if (["image/jpeg", "image/png"].includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("invalid file type: only png and jpeg allowed"), false);
    }
  },
  limits: {
    fileSize: 1024 * 1024 * 3, // only <= 3 mega bytes file can be uploaded
    // 1024*1024 is 1 mega byte (1 MB) file
    // 1 MB is 1024x1024 bytes (File sizes are measured in Bytes (B))
  },
}); // same as storage: storage (if two names of both key and val are same can just use one name)

module.exports = { upload };
