var express = require("express");
const moment = require("moment");
var router = express.Router();

const AccountModel = require("./../models/AccountModel");

/*记账本列表 */
router.get("/account", function (req, res, next) {
  AccountModel.find({ userId: req.session._id })
    .sort({ time: -1 })
    .then((data) => {
      res.render("list", { accounts: data });
    });
});

// 删除
router.get("/remove/:id", (req, res) => {
  let id = req.params.id;
  AccountModel.deleteOne({ _id: id }).then((data) => {
    AccountModel.find({ userId: req.session._id })
      .sort({ time: -1 })
      .then((data) => {
        res.render("list", { accounts: data });
      });
  });
});

/*记账本列表 */
router.get("/account/create", function (req, res, next) {
  // * 相对路径不可靠，会受当前访问路径影响
  res.render("create");
});

router.post("/account", (req, res) => {
  AccountModel.create({
    ...req.body,
    userId: req.session._id,
    // time: moment(req.body.time).toDate(),
  })
    .then((data) => {
      res.render("success", { msg: "添加成功", url: "/account" });
    })
    .catch((err) => {
      res.status(400).send(err);
    });
});

module.exports = router;
