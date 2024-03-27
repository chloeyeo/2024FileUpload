const { Schema, model } = require("mongoose");

const ImageSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    images: [
      // {} is a single image inside [] images list
      {
        filename: String,
        originalFileName: String,
      },
    ],
    // filename: {
    //   type: String,
    //   required: true,
    // },
    // originalFileName: {
    //   type: String,
    //   required: true,
    // },
  },
  { timestamps: true }
);

const Image = model("image", ImageSchema);

module.exports = { Image };
