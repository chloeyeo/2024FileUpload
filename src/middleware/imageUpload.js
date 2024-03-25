const multer = require("multer");
const { v4: uuid } = require("uuid");
const mime = require("uuid");

const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "./uploads");
  },
  filename: function (req, file, callback) {
    callback(null, uuid() + "." + mime.extension(file.mimetype));
  },
});

const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    if (["image/jpeg", "image/png"].includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("invalid file type: only png and jpeg allowed"), false);
    }
  },
  limits: {
    fileSize: 1024 * 1024 * 3,
  },
});

module.exports = { upload };
