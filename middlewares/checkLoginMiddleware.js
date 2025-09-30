module.exports = (req, res, next) => {
  if (!req.session._id) {
    return res.render("fail", { msg: "当前用户未登录", url: "/" });
  }
  next();
};
