const express = require("express");
const mongoose = require("mongoose");
const env = require("env2")("./.env");
const cors = require("cors");
const { boardRouter } = require("./Routes/BoardRouter");
const { userRouter } = require("./Routes/UserRouter");
const { connection } = require("./db.js");
const app = express();

app.use(express.json());

app.use(
  cors({
    origin: "*",
  })
);

// app.get("/", (req, res) => {
//   res.send("Mock Nem 2 Backend");
// });

app.use("/", boardRouter, userRouter);

app.listen(process.env.DB_PORT, async () => {
  try {
    console.log("listening on port " + process.env.DB_PORT);
    await connection;
    console.log("connected to " + process.env.DB_HOST);
  } catch (err) {
    console.log("failed connect to db", err);
  }
});
