const express = require("express");
const router = express.Router();
const OrderController = require("../controllers/OrderController");
const {
  authAdminMiddleware,
  authUserMiddleware,
} = require("../middlewares/authMiddleware");

router.post("/create", authUserMiddleware, OrderController.createOrder);
router.get(
  "/get-by-user/:id",
  authUserMiddleware,
  OrderController.getOrderByUser
);
router.patch(
  "/complete/:id",
  authUserMiddleware,
  OrderController.completeOrder
);

module.exports = router;
