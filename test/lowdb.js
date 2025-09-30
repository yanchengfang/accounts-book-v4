const low = require("lowdb");

const FileSync = require("lowdb/adapters/FileSync");

const adapters = new FileSync("db.json");

const db = low(adapters);
// 初始化数据
// db.defaults({ posts: [], user: {} }).write();

// 写入数据
db.get("posts").unshift({ id: 2, title: "今天天气还不错！" }).write();

// 获取数据
// console.log(db.get("posts").value());

// 删除数据
// let res = db.get("posts").remove({ id: 2 }).write();
// console.log(res);

//获取单条数据
// let res = db.get("posts").find({ id: 1 }).value();
// console.log(res);

// 更新数据(先获取)
db.get("posts").find({ id: 1 }).assign({ title: "今天是阴天！" }).write();
