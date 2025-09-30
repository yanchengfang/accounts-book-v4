const {
  LocalMDUrl,
  AtlasMDUrl_DEV,
  AtlasMDUrl_PRO,
} = require("./../config/config");

module.exports = function (success, failure) {
  if (typeof failure !== "function") {
    failure = () => {
      process.stdout.write("连接失败");
    };
  }
  const mongoose = require("mongoose");

  if (process.env.NODE_ENV !== "production") {
    require("dotenv").config(); // 加载开发环境变量
  } else {
    require("dotenv").config({ path: ".env.production" }); // 加载生产环境变量
  }

  console.log(`当前环境: ${process.env.NODE_ENV}`);
  console.log(`数据库地址: ${process.env.MONGODB_URI}`);

  // 连接mongodb服务
  // mongoose.connect(`mongodb://${DB_host}:${DB_port}/${DB_name}`);
  mongoose.connect(process.env.MONGODB_URI);

  // 设置连接数据库服务的回调
  mongoose.connection.once("open", () => {
    success();
  });
  mongoose.connection.on("error", () => {
    failure();
  });
  mongoose.connection.on("close", () => {
    console.log("连接关闭");
  });
};
