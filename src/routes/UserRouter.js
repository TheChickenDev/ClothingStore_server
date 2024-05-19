const express = require("express");
const router = express.Router();
const UserController = require("../controllers/UserController");
const { uploadUserCloud } = require("../middlewares/uploadFileMiddleware");
const {
  authUserMiddleware,
  authAdminMiddleware,
} = require("../middlewares/authMiddleware");

router.post(
  "/register",
  uploadUserCloud.single("image"),
  UserController.createUser
);
router.post("/login", UserController.loginUser);
router.post("/forgot-password", UserController.forgotPassword);
router.patch("/reset-password", UserController.resetPassword);
router.get("/get-all", authAdminMiddleware, UserController.getAllUser);
router.get("/get-by-id/:id", UserController.getUserById);
router.patch(
  "/update/:id",
  authUserMiddleware,
  uploadUserCloud.single("image"),
  UserController.updateUser
);
router.delete("/delete/:id", authAdminMiddleware, UserController.deleteUser);
router.patch("/add-to-cart/:id", UserController.addToCart);
router.patch("/remove-from-cart/:id", UserController.removeFromCart);
router.post("/payment/:id", UserController.payment);
router.patch("/clear-cart/:id", UserController.clearCart);
router.post("/refresh-token", UserController.refreshToken);

module.exports = router;
