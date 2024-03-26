const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  desc: { type: String, required: true },
  type: { type: String, required: true },
  price: { type: Number, required: true },
  img: {
    type: String,
    required: false,
    default: "",
  },
  imgID: {
    type: String,
    required: false,
    default: "",
  },
  thumbnail: [
    {
      url: {
        type: String,
        required: false,
        defualt: "",
      },
      urlID: {
        type: String,
        required: false,
        defualt: "",
      },
    },
  ],
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
