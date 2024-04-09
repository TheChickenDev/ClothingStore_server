const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    desc: { type: String, required: true },
    type: { type: String, required: true },
    price: { type: Number, required: true },
    prize_before_discount: { type: Number, required: true },
    quantity: { type: Number, required: true },
    sold: { type: Number, required: false, default: 0 },
    view: { type: Number, required: false, default: 0 },
    rating: { type: Number, required: false, default: 0 },
    size: { type: Array, required: false, default: ["S", "M", "L", "XL"] },
    img: {
      type: String,
      required: false,
      default: "",
    },
    imgPath: {
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
        path: {
          type: String,
          required: false,
          defualt: "",
        },
      },
    ],
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
