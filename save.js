const mongoose = require("mongoose");
const express = require("express");
const { BoardModel } = require("../Models/BoardModel");
const { SubTaskModel } = require("../Models/SubTaskModel");
const { TaskModel } = require("../Models/TaskModel");
const BoardRouter = express.Router();

BoardRouter.get("/", async function (req, res) {
  res.send("Mock Nem 2 Backend");
});

BoardRouter.get("/boards", async (req, res) => {
  try {
    let boards = await BoardModel.find({});
    res.status(200).send({ message: "fetched all boards", boards });
  } catch (err) {
    req.status(500).send("failed to get board", err);
  }
});

BoardRouter.post("/create", async (req, res) => {
  try {
    const { name } = req.body;
    const board = new BoardModel({
      name,
    });
    await board.save();
    let all_boards = await BoardModel.find({});
    res.status(200).send({ message: "created new board", data: all_boards });
  } catch (err) {
    req.status(500).send("failed to create board", err);
  }
});

BoardRouter.post("/addTaskToBoard/:id", async function (req, res) {
  try {
    const id = req.params.id;
    console.log(id);

    const { title, description, status, subtasks } = req.body;

    let board = await BoardModel.findById(id);
    const subTask = await SubTaskModel.insertMany(subtasks);

    const task = await new TaskModel({
      title,
      description: description,
      status: status,
      subtask: subTask.map((el) => el.id),
    });
    await task.save();
    board.tasks.push(task);
    await board.save();
    let all_boards = await BoardModel.find({});
    res
      .status(200)
      .send({ message: "task added successfully", data: all_boards });
  } catch (err) {
    req.status(500).send("failed to add task to board", err);
  }
});

BoardRouter.get("tasks/:id", async function (req, res) {
  try {
    let task = await TaskModel.find({ _id: req.params.id });
    res.status(200).send({ message: "task sent successfully", data: task });
  } catch (err) {}
});

module.exports = { BoardRouter };
