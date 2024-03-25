const multer = require("multer");
const { v4: uuid } = require("uuid");
const mime = require("mime-types");

const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    // SAME as multer({ dest: 'uploads/' })
    // they both upload files to the uploads folder
    callback(null, "./uploads");
  },
  filename: function (req, file, callback) {
    // mime.extension gets the default extension for a content-type
    // here the content-type given as file.mimetype is e.g. image/png
    // then mime.extension finds the default extension for the image/png
    // content type which would be extension .png
    callback(null, uuid() + "." + mime.extension(file.mimetype));
  },
});

// const upload = multer({ dest: "uploads/" });

/* multer({optionsObject})
Multer accepts an options object.
If you omit the options object, the files will be kept in memory and never written to disk.
*/
const upload = multer({
  // same as storage: storage where first storage is field name as required by multer
  // and second storage after : refers to the above const storage = multer.diskStorage
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
