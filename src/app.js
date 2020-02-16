const express = require("express");
const app = express();
const apiEndpoints = require("./data/apiEndpoints");
const pokemonRouter = require("./routes/pokemon.route");

app.use(express.json());
app.use("/pokemon", pokemonRouter);

app.get("/", (req, res) => {
  res.status(200).send(apiEndpoints);
});

app.use((err, req, res, next) => {
  res.status(err.statusCode || 500);
  console.log(err);
  if (err.statusCode) {
    res.send({ error: err.message });
  } else {
    res.send({ error: "internal server error" });
  }
});

module.exports = app;
