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
    //const user = await User.findOne({ _id: userId });
    // const user = await User.findById({ _id: userId });
    const user = await User.findById(userId);
    //const user = await User.findById({userId}); // only THIS does NOT work the above 3 DOES WORK!
    return res.send({ user });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
});

userRouter.post("/", upload.single("image"), async function (req, res) {
  try {
    const { filename, originalname } = req.file;
    //Extract user data from the request body
    // const {
    //   username,
    //   age,
    //   email,
    //   name: { first, last },
    // } = req.body;

    //Create a new User instance with the extracted data
    // const user = new User({
    //   username,
    //   age,
    //   email,
    //   name: { first, last },
    //   filename, // Include filename from req.file
    //   originalname, // Include originalname from req.file
    // });
    /*
    {
      "user": {
          "username": "\"Amy01\"",
          "name": {
              "first": "Amy",
              "last": "Adams"
          },
          "age": 25,
          "email": "example@example.com",
          "filename": "17713a24-3a9f-4442-a95f-7e1cc09eb41b.jpeg",
          "originalname": "img1.jpg",
          "_id": "660154c4781c4f4ccdf0b16c"
      }
    } */
    console.log("req.file.originalname:", originalname);
    console.log("req.file.filename:", filename);
    //const user = new User(req.body, filename, originalname);
    /*Mongoose's model function expects only one argument, which is an object
    representing the data to be saved to the database. Passing req.body as the
    first argument and the file-related data as separate arguments doesn't match
    this expectation, resulting in an error.
    The reason why const user = new User(req.body) works is because Mongoose's
    model function can directly accept an OBJECT representing the data
    to be saved to the database.
    const user = new User(req.body, filename, originalname); then this will
    ONLY recognise req.body and ignore the two parameters after the first object param.*/
    /*
    {
      "user": {
          "username": "\"Amy01\"",
          "name": {
              "first": "Amy",
              "last": "Adams"
          },
          "age": 25,
          "email": "example@example.com"
      }
    } */
    // ...req.body is deep copy that gets inner content from {}
    // which means req.body is an object, but ...req.body is no longer an object
    // so we need to wrap them in {} to be a single object to work
    // since model (=User) in mongoose only accepts a SINGLE OBJECT in param
    // and ignores all extra parameters.
    const user = new User({ ...req.body, filename, originalname });
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
    console.log("req.body:", req.body); // , gives one space
    console.log("req.file:", req.file);
    // req.body: {}
    // req.file: undefined <- why??
    const {
      username,
      name: { first, last },
      age,
      email,
    } = req.body;
    const { filename, originalname } = req.file;
    const user = await User.findByIdAndUpdate(
      userId,
      {
        username,
        name: { first, last },
        age,
        email,
        filename,
        originalname,
      },
      { new: true }
    );
    // const user = await User.findByIdAndUpdate(
    //   userId,
    //   {
    //     ...req.body,
    //     filename,
    //     originalname,
    //   },
    //   { new: true }
    // );
    return res.send({ user });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
});

module.exports = { userRouter };
