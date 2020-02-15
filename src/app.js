const express = require("express");
const app = express();
const apiEndpoints = require("./data/apiEndpoints");

app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).send(apiEndpoints);
});

module.exports = app;
