const User = require("../models/UserModel");
const bcrypt = require("bcrypt");
const cloudinary = require("cloudinary").v2;
const JWTService = require("./JWTService");

const createUser = (data, imageFile) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { name, email, password, isAdmin, address, phone, cart } = data;
      const checkUserByEmail = await User.findOne({
        email,
      });
      const checkUserByPhone = await User.findOne({
        phone,
      });
      if (checkUserByEmail) {
        if (imageFile) cloudinary.uploader.destroy(imageFile.filename);
        resolve({
          status: "OK",
          message: "Email đã tồn tại!",
        });
      } else if (checkUserByPhone) {
        if (imageFile) cloudinary.uploader.destroy(imageFile.filename);
        resolve({
          status: "OK",
          message: "Số điện thoại đã tồn tại!",
        });
      } else {
        const avatar = imageFile?.path;
        const avatarID = imageFile?.filename;
        const hashPassword = bcrypt.hashSync(password, 12);
        const newUser = await User.create({
          name,
          email,
          password: hashPassword,
          isAdmin,
          address,
          phone,
          cart,
          avatar,
          avatarID,
        });
        if (newUser) {
          resolve({
            status: "OK",
            message: "Tạo tài khoản thành công!",
            data: newUser,
          });
        }
      }
    } catch (error) {
      reject(error);
    }
  });
};

const loginUser = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { email, password } = data;
      const user = await User.findOne({ email });
      if (!user) {
        resolve({
          status: "ERR",
          message: "Email không tồn tại!",
        });
      }
      const checkPassword = bcrypt.compareSync(password, user.password);
      if (!checkPassword) {
        resolve({
          status: "ERR",
          message: "Mật khẩu không chính xác!",
        });
      } else {
        const access_token = await JWTService.generateAccessToken({
          id: user._id,
          isAdmin: user.isAdmin,
        });
        const refresh_token = await JWTService.generateRefreshToken({
          id: user._id,
          isAdmin: user.isAdmin,
        });
        resolve({
          status: "OK",
          message: "Đăng nhập thành công!",
          data: {
            access_token,
            refresh_token,
            user: { email: user.email, name: user.name },
          },
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};

const getAllUser = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const userList = await User.find();
      if (userList) {
        resolve({
          status: "OK",
          message: "Lấy danh sách tài khoản thành công!",
          data: userList,
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};

const getUserById = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await User.findById(userId);
      if (!user) {
        resolve({
          status: "OK",
          message: "Không tìm thấy tài khoản!",
        });
      }
      resolve({
        status: "OK",
        message: "Lấy thông tin tài khoản thành công!",
        data: user,
      });
    } catch (error) {
      reject(error);
    }
  });
};

const updateUser = (userId, data, imageFile) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { name, password, address, phone } = data;
      const checkUserByPhone = await User.findOne({ phone });
      if (checkUserByPhone) {
        resolve({
          status: "ERR",
          message: "Số điện thoại đã tồn tại!",
        });
      }
      const user = await User.findById(userId);
      if (!user) {
        if (imageFile) cloudinary.uploader.destroy(imageFile.filename);
        resolve({
          status: "ERR",
          message: "Tài khoản không tồn tại!",
        });
      }
      if (user?.avatarID && imageFile) {
        var imageID = user.avatarID;
        if (imageID) cloudinary.uploader.destroy(imageID);
      }
      const avatar = imageFile?.path;
      const avatarID = imageFile?.filename;
      const hashPassword = password ? bcrypt.hashSync(password, 12) : undefined;
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        {
          name,
          password: hashPassword,
          address,
          phone,
          avatar,
          avatarID,
        },
        { new: true }
      );
      resolve({
        status: "OK",
        message: "Cập nhật tài khoản thành công!",
        data: updatedUser,
      });
    } catch (error) {
      reject(error);
    }
  });
};

const deleteUser = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await User.findById(userId);
      if (!user) {
        resolve({
          status: "ERR",
          message: "Không tìm thấy tài khoản!",
        });
      }
      const imageID = user?.avatarID;
      if (imageID) cloudinary.uploader.destroy(imageID);
      await User.findByIdAndDelete(userId);
      resolve({
        status: "OK",
        message: "Xóa tài khoản thành công!",
      });
    } catch (error) {
      reject(error);
    }
  });
};

const addToCart = (userId, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { productId, name, img, quantity, price } = data;
      const user = await User.findById(userId);
      if (!user) {
        resolve({
          status: "ERR",
          message: "Tài khoản không tồn tại!",
        });
      }
      const product = user.cart?.find((item) => item.productId === productId);
      if (product) {
        product.quantity = parseInt(product.quantity) + parseInt(quantity);
      } else {
        user.cart.push({ productId, name, img, quantity, price });
      }
      await user.save();
      resolve({
        status: "OK",
        message: "Thêm sản phẩm vào giỏ hàng thành công!",
      });
    } catch (error) {
      reject(error);
    }
  });
};

const removeFromCart = (userId, productId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await User.findById(userId);
      if (!user) {
        resolve({
          status: "ERR",
          message: "Tài khoản không tồn tại!",
        });
      }
      const productIndex = user.cart.findIndex(
        (item) => item.productId === productId
      );
      if (productIndex !== -1) {
        user.cart.splice(productIndex, 1);
        await user.save();
        resolve({
          status: "OK",
          message: "Xóa sản phẩm khỏi giỏ hàng thành công!",
        });
      } else {
        resolve({
          status: "ERR",
          message: "Không tìm thấy sản phẩm trong giỏ hàng!",
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};

const clearCart = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await User.findById(userId);
      if (!user) {
        resolve({
          status: "ERR",
          message: "Tài khoản không tồn tại!",
        });
      }
      user.cart = [];
      await user.save();
      resolve({
        status: "OK",
        message: "Dọn sạch giỏ hàng thành công!",
      });
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  createUser,
  loginUser,
  getAllUser,
  getUserById,
  updateUser,
  deleteUser,
  addToCart,
  removeFromCart,
  clearCart,
};
