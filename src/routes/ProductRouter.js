const express = require("express");
const router = express.Router();
const ProductController = require("../controllers/ProductController");
const { uploadProductCloud } = require("../middlewares/uploadFileMiddleware");
const {
  authAdminMiddleware,
  authUserMiddleware,
} = require("../middlewares/authMiddleware");

router.post(
  "/create",
  authAdminMiddleware,
  uploadProductCloud.single("image"),
  ProductController.createProduct
);
router.get("/get", ProductController.getProducts);
router.get("/get-by-id/:id", ProductController.getProductById);
router.patch(
  "/update/:id",
  authAdminMiddleware,
  uploadProductCloud.single("image"),
  ProductController.updateProduct
);
router.delete(
  "/delete/:id",
  authAdminMiddleware,
  ProductController.deleteProduct
);

module.exports = router;
