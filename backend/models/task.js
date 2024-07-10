const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  desc: {
    type: String,
    required: true,
  },
  important: {
    type: Boolean,
    default: false,
  },
  completed: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("Task", taskSchema);
