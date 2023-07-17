const mongoose = require("mongoose");
const env = require("env2")("./.env");

const url = process.env.DB_HOST;

const connection = mongoose.connect(url);

module.exports = { connection: connection };
