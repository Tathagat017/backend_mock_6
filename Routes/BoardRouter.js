const express = require("express");
const { BoardModel } = require("../Models/BoardModel");
const { TaskModel } = require("../Models/TaskModel");
const { SubTaskModel } = require("../Models/SubTaskModel");

const boardRouter = express.Router();

boardRouter.post("/create", async (req, res) => {
  try {
    const { name } = req.body;
    const board = new BoardModel({ name: name });
    board.save();
    res.send({ msg: "Board Created" });
  } catch (error) {
    res.send({ msg: "Something went wrong", error: error.message });
  }
});

boardRouter.get("/", async (req, res) => {
  try {
    const boards = await BoardModel.find({}).populate({
      path: "tasks",
      populate: { path: "subtask" },
    });
    res.send(boards);
  } catch (error) {}
});

boardRouter.get("/:boardId", async (req, res) => {
  const boardID = req.params.boardId;
  try {
    const board = await BoardModel.find({ _id: boardID }).populate({
      path: "tasks",
      populate: { path: "subtask" },
    });
    res.send(board);
    console.log(board);
  } catch (error) {}
});
boardRouter.post("/:boardId/task/add", async (req, res) => {
  const boardID = req.params.boardId;
  const { title, description, status, subtasks } = req.body;
  try {
    const board = await BoardModel.findById(boardID);
    const subTask = await SubTaskModel.insertMany(subtasks);
    const task = new TaskModel({
      title,
      description,
      status,
      subtask: subTask.map((el) => el._id),
    });
    await task.save();
    board.tasks.push(task);
    await board.save();
    res.send({ msg: "Task Added" });
  } catch (error) {
    res.send({ msg: "Something went wrong", error: error.message });
  }
});

boardRouter.get("/task/:taskID", async (req, res) => {
  const taskId = req.params.taskID;
  try {
    const task = await TaskModel.find({ _id: taskId }).populate("subtask");
    res.send(task);
  } catch (error) {
    res.send({ msg: "Something went wrong", error: error.message });
  }
});

boardRouter.patch("/task/update/:taskID", async (req, res) => {
  const taskId = req.params.taskID;
  const paylaod = req.body;
  try {
    await TaskModel.findByIdAndUpdate({ _id: taskId }, paylaod);
    res.send({ msg: "Task Updated" });
  } catch (error) {
    res.send({ msg: "Something went wrong", error: error.message });
  }
});

boardRouter.delete("/task/delete/:taskID", async (req, res) => {
  const taskId = req.params.taskID;
  try {
    await TaskModel.findByIdAndDelete({ _id: taskId });
    res.send({ msg: "Task Deleted" });
  } catch (error) {
    res.send({ msg: "Something went wrong", error: error.message });
  }
});

boardRouter.patch("/subtask/:subtaskID", async (req, res) => {
  const subtaskId = req.params.subtaskID;
  const paylaod = req.body;
  try {
    await SubTaskModel.findByIdAndUpdate({ _id: subtaskId }, paylaod);
    res.send({ msg: "SubTask Updated" });
  } catch (error) {
    res.send({ msg: "Something went wrong", error: error.message });
  }
});

module.exports = { boardRouter };
