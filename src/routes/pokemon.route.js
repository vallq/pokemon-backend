const express = require("express");
const router = express.Router();
const BasicPokemon = require("../models/pokemon.model");

const filterByName = async searchTerm => {
  const regexFilter = new RegExp(searchTerm, "gi");
  const filteredPokemon = await BasicPokemon.find({ name: regexFilter });
  return filteredPokemon;
};

router.get("/", async (req, res) => {
  if (req.query == "") {
    const pokemon = await BasicPokemon.find();
    console.log(pokemon);
    console.log(filterByName("chu"));
    res.status(200).send(pokemon);
  } else {
    const searchTerm = req.query.name;
    const expectedPokemon = await filterByName(searchTerm);
    res.status(200).send(expectedPokemon);
  }
});
module.exports = router;
