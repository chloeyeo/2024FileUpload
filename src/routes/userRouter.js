const { Router } = require("express");
const userRouter = Router();
const { User } = require("../models/User");
const { upload } = require("../middleware/imageUpload");

userRouter.get("/", async function (req, res) {
  try {
    const users = await User.find({});
    return res.send({ users });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
});

userRouter.get("/:userId", async function (req, res) {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    return res.send({ user });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
});

userRouter.post("/", upload.single("image"), async function (req, res) {
  try {
    const { filename, originalname } = req.file;
    const image = { filename, originalFileName: originalname };
    //but const image = {req.file.filename, originalFileName: req.file.originalname} does not work
    // does not work since object {} must be in key value form!! so below: will work
    // const image = {
    //   filename: req.file.filename,
    //   originalFileName: req.file.originalname,
    // };
    const user = new User({
      ...req.body,
      image,
    });
    await user.save();
    return res.send({ user });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
});

userRouter.delete("/:userId", async function (req, res) {
  try {
    const { userId } = req.params;
    const user = await User.findByIdAndDelete(userId);
    return res.send({ user });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
});

// update whole
userRouter.put("/:userId", upload.single("image"), async function (req, res) {
  try {
    const { userId } = req.params;
    const { filename, originalname } = req.file;
    const image = { filename, originalFileName: originalname };
    const user = await User.findByIdAndUpdate(
      userId,
      {
        ...req.body,
        image,
      },
      { new: true }
    );
    return res.send({ user });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
});

module.exports = { userRouter };
