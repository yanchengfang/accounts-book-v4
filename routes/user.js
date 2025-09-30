var express = require("express");
var router = express.Router();

const md5 = require("md5");

const UserModel = require("../models/UserModel");

/* GET users listing. */
router.get("/", function (req, res) {
  res.render("reg");
});

// 注册
router.post("/reg", (req, res) => {
  const { username, password } = req.body;
  if (username && password) {
    UserModel.create({ username, password: md5(password) })
      .then((data) => {
        res.render("success", { msg: "注册成功", url: "/" });
      })
      .catch((err) => {
        res.render("fail", { msg: "注册失败", url: "/" });
      });
  } else {
    res.render("fail", { msg: "注册失败", url: "/" });
  }
});

// 登录
router.post("/login", (req, res) => {
  const { username, password } = req.body;
  UserModel.findOne({ username: username, password: md5(password) })
    .then((data) => {
      if (data !== null) {
        // 将用户名字和id写入session中
        // 此时数据还在内存中，尚未保存到数据库

        // *（写入）当响应准备返回时，express-session会：
        // 1. 检测到req.session被修改
        // 2. 将req.session对象序列化
        // 3. 使用sessionID作为键，session对象为值保存到数据库
        // 4. 然后才发送响应
        req.session.username = data.username;
        req.session._id = data._id;

        res.render("success", { msg: "登录成功", url: "/account" });
      } else {
        res.render("fail", {
          msg: "登录失败，账号或密码错误",
          url: "/",
        });
      }
    })
    .catch((err) => {
      res.render("fail", { msg: "登录失败", url: "/" });
    });
});

// 退出
router.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.render("success", { msg: "退出成功", url: "/" });
  });
});

module.exports = router;
