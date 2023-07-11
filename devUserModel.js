const mongoose = require("mongoose");
const devuser = new mongoose.Schema({
  fullname: {
    type: "string",
    required: true,
  },
  email: {
    type: "string",
    required: true,
  },
  mobile: {
    type: "string",
    required: true,
  },
  skills: {
    type: "string",
    required: true,
  },
  password: {
    type: "string",
    required: true,
  },
  confirmpassword: {
    type: "string",
    required: true,
  },
});

module.exports = mongoose.model("devuser", devuser);
