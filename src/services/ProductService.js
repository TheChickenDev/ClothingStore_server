const Product = require("../models/ProductModel");
const cloudinary = require("cloudinary").v2;

const createProduct = (data, imageFile) => {
  return new Promise(async (resolve, reject) => {
    const { name, desc, type, price } = data;
    try {
      const checkedProduct = await Product.findOne({ name });
      if (checkedProduct) {
        if (imageFile) {
          cloudinary.uploader.destroy(imageFile.filename);
        }
        resolve({
          status: "ERR",
          message: "Sản phẩm đã tồn tại!",
        });
      } else {
        const img = imageFile?.path;
        const imgID = imageFile?.filename;
        const newProduct = await Product.create({
          name,
          desc,
          type,
          price,
          img,
          imgID,
        });
        if (newProduct) {
          resolve({
            status: "OK",
            message: "Thêm sản phẩm thành công!",
            data: newProduct,
          });
        }
      }
    } catch (error) {
      reject(error);
    }
  });
};

const getAllProducts = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const productList = await Product.find();
      if (productList) {
        resolve({
          status: "OK",
          message: "Lấy danh sách sản phẩm thành công!",
          data: productList,
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};

const getProductById = (productId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const product = await Product.findById(productId);
      if (product) {
        resolve({
          status: "OK",
          message: "Lấy thông tin sản phẩm thành công!",
          data: product,
        });
      } else {
        resolve({
          status: "ERR",
          message: "Không tìm thấy sản phẩm!",
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};

const updateProduct = (data, productId, imageFile) => {
  return new Promise(async (resolve, reject) => {
    try {
      const product = await Product.findById(productId);
      if (product) {
        const img = imageFile?.path;
        const imgID = imageFile?.filename;
        newData = { ...data, img, imgID };

        if (product?.imgID && imageFile) {
          var imageID = product.imgID;
          if (imageID) cloudinary.uploader.destroy(imageID);
        }

        updatedProduct = await Product.findByIdAndUpdate(productId, newData, {
          new: true,
        });
        resolve({
          status: "OK",
          message: "Cập nhật sản phẩm thành công!",
          data: updatedProduct,
        });
      } else {
        if (imageFile) {
          cloudinary.uploader.destroy(imageFile.filename);
        }
        resolve({
          status: "ERR",
          message: "Không tìm thấy sản phẩm!",
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};

const deleteProduct = (productId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const product = await Product.findById(productId);
      if (product) {
        if (product?.imgID) {
          var imageID = product.imgID;
          if (imageID) cloudinary.uploader.destroy(imageID);
        }
        await Product.findByIdAndDelete(productId);
        resolve({
          status: "OK",
          message: "Xóa sản phẩm thành công!",
        });
      } else {
        resolve({
          status: "ERR",
          message: "Không tìm thấy sản phẩm!",
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
