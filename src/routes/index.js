const ProductRouter = require("./ProductRouter");
const UserRouter = require("./UserRouter");

const routes = (app) => {
  app.use("/api/product", ProductRouter);
  app.use("/api/user", UserRouter);
};

module.exports = routes;
