const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  customerId: { type: String, required: true },
  orderDate: { type: Date, required: true },
  deliveryDate: {
    type: Date,
    required: true,
  },
  isCompleted: {
    type: Boolean,
    required: false,
    default: false,
  },
  products: [
    {
      productId: {
        type: String,
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      img: {
        type: String,
        required: true,
      },
    },
  ],
  totalAmount: {
    type: Number,
    required: false,
  },
  note: {
    type: String,
    required: false,
  },
  paymentMethod: {
    type: String,
    required: true,
  },
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
