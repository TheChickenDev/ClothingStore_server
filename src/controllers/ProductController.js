const { response } = require("express");
const ProductService = require("../services/ProductService");

const createProduct = async (req, res) => {
  try {
    const { name, desc, type, price } = req.body;
    if (!name || !desc || !type || !price) {
      return res.status(200).json({
        status: "ERR",
        message: "Các trường không được để trống!",
      });
    }
    const imageFile = req.file;
    const response = await ProductService.createProduct(req.body, imageFile);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(404).json({
      message: error,
    });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const response = await ProductService.getAllProducts();
    return res.status(200).json(response);
  } catch (error) {
    return res.status(404).json({
      message: error,
    });
  }
};

const getProductById = async (req, res) => {
  try {
    const productId = req.params.id;
    const response = await ProductService.getProductById(productId);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(404).json({
      message: error,
    });
  }
};

const updateProduct = async (req, res) => {
  try {
    const imageFile = req.file;
    const { name, desc, type, price } = req.body;
    if (!name && !desc && !type && !price && !imageFile) {
      return res.status(200).json({
        status: "ERR",
        message: "Không có dữ liệu nào được thay đổi!",
      });
    }
    const productId = req.params.id;
    const response = await ProductService.updateProduct(
      req.body,
      productId,
      imageFile
    );
    return res.status(200).json(response);
  } catch (error) {
    return res.status(404).json({
      message: error,
    });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const response = await ProductService.deleteProduct(productId);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(404).json({
      message: error,
    });
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
