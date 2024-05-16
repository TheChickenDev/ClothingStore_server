const User = require("../models/UserModel");
const bcrypt = require("bcrypt");
const cloudinary = require("cloudinary").v2;
const JWTService = require("./JWTService");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");

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
          status: "ERR",
          message: "Email đã tồn tại!",
        });
      } else if (checkUserByPhone) {
        if (imageFile) cloudinary.uploader.destroy(imageFile.filename);
        resolve({
          status: "ERR",
          message: "Số điện thoại đã tồn tại!",
        });
      } else {
        const avatar = imageFile?.path;
        const avatarPath = imageFile?.filename;
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
          avatarPath,
        });
        const access_token = await JWTService.generateAccessToken({
          id: newUser._id,
          isAdmin: newUser.isAdmin,
          email: newUser.email,
          avatar: newUser.avatar,
        });
        const refresh_token = await JWTService.generateRefreshToken({
          id: newUser._id,
          isAdmin: newUser.isAdmin,
          email: newUser.email,
          avatar: newUser.avatar,
        });
        if (newUser) {
          resolve({
            status: "OK",
            message: "Tạo tài khoản thành công!",
            data: {
              access_token,
              refresh_token,
              user: {
                _id: newUser._id,
                isAdmin: newUser.isAdmin,
                name: newUser.name,
                email: newUser.email,
                address: newUser.address,
                avatar: newUser.avatar,
                phone: newUser.phone,
                createdAt: newUser.createdAt,
                updatedAt: newUser.updatedAt,
              },
            },
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
          email: user.email,
          avatar: user.avatar,
        });
        const refresh_token = await JWTService.generateRefreshToken({
          id: user._id,
          isAdmin: user.isAdmin,
          email: user.email,
          avatar: user.avatar,
        });
        resolve({
          status: "OK",
          message: "Đăng nhập thành công!",
          data: {
            access_token,
            refresh_token,
            user: {
              _id: user._id,
              isAdmin: user.isAdmin,
              name: user.name,
              email: user.email,
              address: user.address,
              avatar: user.avatar,
              phone: user.phone,
              createdAt: user.createdAt,
              updatedAt: user.updatedAt,
            },
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
          status: "ERR",
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
      if (checkUserByPhone && checkUserByPhone.phone !== phone) {
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
      if (user?.avatarPath && imageFile) {
        var imageID = user.avatarPath;
        if (imageID) cloudinary.uploader.destroy(imageID);
      }
      const avatar = imageFile?.path;
      const avatarPath = imageFile?.filename;
      const hashPassword = password ? bcrypt.hashSync(password, 12) : undefined;
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        {
          name,
          password: hashPassword,
          address,
          phone,
          avatar,
          avatarPath,
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
      const imageID = user?.avatarPath;
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

const forgotPassword = (email, operating_system) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await User.findOne({ email });
      if (!user) {
        resolve({
          status: "ERR",
          message: "Email không tồn tại!",
        });
      }

      const { reset_token, randomNumber } =
        await JWTService.generateResetPasswordToken(email);

      const from = `HeinShop <${process.env.MY_EMAIL}>`;
      const subject = "Reset password OTP";
      const html = `
        <!DOCTYPE html>
        <html>
        <head>
        <style>
        body {
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 0;
          background-color: #f7f7f7;
        }

        .container {
          width: 80%;
          margin: 0 auto;
          background-color: #f1f1f1;
          padding: 20px;
          border-radius: 4px;
        }

        .otp {
          max-width: 100px;
          background-color: #f50963;
          padding: 10px;
          border-radius: 4px;
          text-align: center;
          font-size: 18px;
          font-weight: bold;
          color: #fff;
          margin: 20px auto;
        }

        .footer {
          margin-top: 20px;
          border-top: 1px solid #ddd;
          padding-top: 20px;
          font-size: 12px;
          text-align: center;
          color: #888;
        }
        </style>
        </head>
        <body>
        <div class="container">
          <h3>Hi ${user.name},</h3>
          <p>You recently requested to reset your password for your HeinShop account. Use the OTP below to reset it. This password reset is only valid for the next 10 minutes.</p>
          <div class="otp">${randomNumber}</div>
          <p>For security, this request was received from a device using "${operating_system}". If you did not request a password reset, please ignore this email or contact support if you have questions.</p>
          <p>Thanks,</p>
          <p>The HeinShop Team</p>
          <div class="footer">
            © 2019 HeinShop. All rights reserved.<br>
            Ho Chi Minh City University of Technology and Education<br>
            1st Street Vo Van Ngan.<br>
            Thu Duc District, Ho Chi Minh City
          </div>
        </div>
        </body>
        </html>
        `;

      let mailOptions = {
        from,
        to: email,
        subject,
        html,
      };

      let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.MY_EMAIL,
          pass: process.env.MY_EMAIL_PASSWORD,
        },
      });

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          resolve({
            status: "ERR",
            message: error.message,
          });
        } else {
          resolve({
            status: "OK",
            message: `OTP đã được gửi về ${email}!`,
            data: reset_token,
          });
        }
      });
    } catch (error) {
      reject(error);
    }
  });
};

const resetPassword = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { key, token, password, confirm_password } = data;
      jwt.verify(token, process.env.ACCESS_TOKEN, async (err, payload) => {
        if (err) {
          return resolve({
            status: "ERR",
            message: "Yêu cầu đã hết hạn!",
          });
        }
        const user = await User.findOne({ email: payload.email });
        if (!user) {
          return resolve({
            status: "ERR",
            message: "Email không tồn tại!",
          });
        }
        if (Number(key) !== payload.key) {
          return resolve({
            status: "ERR",
            message: "OTP không chính xác!",
          });
        }
        if (password !== confirm_password) {
          return resolve({
            status: "ERR",
            message: "Mật khẩu không khớp!",
          });
        }
        const hashPassword = bcrypt.hashSync(password, 12);
        await User.findOneAndUpdate(
          { email: payload.email },
          {
            password: hashPassword,
          },
          { new: true }
        );
        return resolve({
          status: "OK",
          message: "Đặt lại mật khẩu thành công!",
        });
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
  forgotPassword,
  resetPassword,
};
