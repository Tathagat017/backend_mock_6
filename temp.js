const mongoose = require("mongoose");

const Schema = mongoose.Schema({
  userId: String,
  name: String,
  tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tasks" }],
});

const BoardModel = mongoose.model("Board", Schema);
module.exports = { BoardModel };
