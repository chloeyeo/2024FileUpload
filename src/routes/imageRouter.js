const Router = require("express");
const imageRouter = Router();
const { upload } = require("../middleware/imageUpload");
const { Image } = require("../models/Image");

imageRouter.get("/", async function (req, res) {
  try {
    const images = await Image.find();
    return res.send({ images });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
});

imageRouter.get("/:imageId", async function (req, res) {
  try {
    const { imageId } = req.params;
    const image = await Image.findById(imageId);
    return res.send({ image });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
});

// imageRouter.post("/", upload.single("image"), async function (req, res) {
//   try {
//     const { filename, originalname } = req.file;
//     const image = await new Image({
//       ...req.body,
//       filename,
//       originalFileName: originalname,
//     }).save(); // save() is a promise thus needs await
//     return res.send({ image });
//   } catch (error) {
//     return res.status(500).send({ error: error.message });
//   }
// });

imageRouter.post("/", upload.array("images", 5), async function (req, res) {
  // post does not put image
  try {
    const images = [];
    req.files.forEach((file) => {
      images.push({
        filename: file.filename,
        originalFileName: file.originalname,
      });
    });

    const NewPost = await new Image({ ...req.body, images }).save();
    return res.send({ NewPost });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
});

imageRouter.delete("/:imageId", async function (req, res) {
  try {
    const { imageId } = req.params;
    const image = await Image.findByIdAndDelete(imageId);
    return res.send({ image });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
});

imageRouter.put("/:imageId", upload.single("image"), async function (req, res) {
  // put uploads image
  try {
    const { imageId } = req.params;
    const { filename, originalname } = req.file;
    const image = await Image.findByIdAndUpdate(
      imageId,
      {
        ...req.body,
        filename,
        originalFileName: originalname,
      },
      { new: true }
    );
    return res.send({ image });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
});

module.exports = { imageRouter };
