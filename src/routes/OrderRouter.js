const express = require("express");
const router = express.Router();
const OrderController = require("../controllers/OrderController");
const {
  authAdminMiddleware,
  authUserMiddleware,
} = require("../middlewares/authMiddleware");

router.post("/create", OrderController.createOrder);
router.get("/get-by-user/:id", OrderController.getOrderByUser);
router.patch("/complete/:id", OrderController.completeOrder);

module.exports = router;
