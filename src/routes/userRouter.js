const { Router } = require("express");
const userRouter = Router();
const User = require("../models/User");

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
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
});

userRouter.get("/:userId:fileName", async function (req, res) {
  try {
    const { userId, fileName } = req.params;
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
});

module.exports = { userRouter };
