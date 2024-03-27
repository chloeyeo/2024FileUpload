const { Schema, model } = require("mongoose");

const UserSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: { type: String, required: true, unique: true },
    password: { type: String, minLength: 5, required: true },
    role: { type: Number, required: true, default: 0 }, // role is for authentication - i.e. it is user grade
    image: {
      // single image so {} without []
      filename: { type: String, default: "noimage.jpg" },
      originalFileName: { type: String, default: "noimage.jpg" },
    },
    // images: [ // many images = []
    //   // {} is a single image inside [] images list
    //   {
    //     filename: { type: String, default: "noimage.jpg" },
    //     originalFileName: { type: String, default: "noimage.jpg" },
    //   },
    // ],
  },
  { timestamps: true }
);

const User = model("user", UserSchema);

module.exports = { User };
