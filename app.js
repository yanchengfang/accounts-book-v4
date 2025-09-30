var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const session = require("express-session");
const MongoStore = require("connect-mongo");
// const favicon = require("serve-favicon");

// 中间件
const checkLoginMiddleware = require("./middlewares/checkLoginMiddleware");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/user");

var app = express();
// 处理 /favicon.ico 请求
app.get("/favicon.ico", (req, res) => res.status(204));

// *（读取）当请求到达时：
// 1. 从Cookie中提取sessionID
// 2. 使用sessionID从数据库查询对应的会话数据
// 3. 将查询结果反序列化后挂载到req.session
app.use(
  session({
    name: "sid",
    secret: "wasd", // 加盐
    saveUninitialized: false, // 不写入空对象
    resave: false, // 是否在每次请求时重新保存session，20分钟，（持续操作时延时登陆态过期时间）
    store: MongoStore.create({
      // mongoUrl: `mongodb://${DB_host}:${DB_port}/${DB_name}`,
      mongoUrl: process.env.MONGODB_URI,
    }),
    cookie: {
      httpOnly: true,
      maxAge: 1000 * 60 * 5, // 不设置maxAge，当前登录态是会话级别的，关闭浏览就会消失
    },
  })
);

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", usersRouter);
// app.use(checkLoginMiddleware);
app.use("/", checkLoginMiddleware, indexRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
