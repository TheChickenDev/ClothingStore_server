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
router.get("/get-all", authAdminMiddleware, UserController.getAllUser);
router.get("/get-by-id/:id", authUserMiddleware, UserController.getUserById);
router.patch(
  "/update/:id",
  authUserMiddleware,
  uploadUserCloud.single("image"),
  UserController.updateUser
);
router.delete("/delete/:id", authAdminMiddleware, UserController.deleteUser);
router.patch("/add-to-cart/:id", authUserMiddleware, UserController.addToCart);
router.patch(
  "/remove-from-cart/:id",
  authUserMiddleware,
  UserController.removeFromCart
);
router.patch("/clear-cart/:id", authUserMiddleware, UserController.clearCart);

module.exports = router;
