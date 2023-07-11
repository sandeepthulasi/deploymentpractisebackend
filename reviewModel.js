const mongoose = require("mongoose");

const review = new mongoose.Schema({
  taskprovider: {
    type: "string",
    required: true,
  },
  taskworker: {
    type: "string",
    required: true,
  },
  rating: {
    type: "string",
    required: true,
  },
});

module.exports = mongoose.model("review", review);
