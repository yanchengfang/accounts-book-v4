const mongoose = require("mongoose");

const AccountSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
    unique: true,
  },
  time: {
    type: Date,
    required: true,
  },
  type: {
    type: Number,
    enum: [-1, 1],
  },
  account: {
    type: Number,
    required: true,
  },
  remarks: {
    type: String,
    default: "无",
  },
});

const AccountModel = mongoose.model("account", AccountSchema);

module.exports = AccountModel;
