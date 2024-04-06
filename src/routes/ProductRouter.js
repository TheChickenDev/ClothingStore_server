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
  uploadProductCloud.single("image"),
  ProductController.createProduct
);
router.get("/get-all", ProductController.getProducts);
router.get(
  "/get-by-id/:id",
  authUserMiddleware,
  ProductController.getProductById
);
router.patch(
  "/update/:id",
  authAdminMiddleware,
  uploadProductCloud.single("image"),
  ProductController.updateProduct
);
router.delete("/delete/:id", ProductController.deleteProduct);

module.exports = router;
