const express = require("express");
const router = express.Router();
const pokemonData = require("../data/pokemonData");

router.get("/", async (req, res) => {
  res.status(200).send(pokemonData);
});

module.exports = router;
