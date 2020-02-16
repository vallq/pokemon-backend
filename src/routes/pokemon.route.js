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
    res.status(200).send(pokemon);
  } else {
    const searchTerm = req.query.name;
    const expectedPokemon = await filterByName(searchTerm);
    res.status(200).send(expectedPokemon);
  }
});

router.post("/", async (req, res) => {
  const pokemonToPost = new BasicPokemon(req.body);
  //await BasicPokemon.init();
  const newPokemon = await pokemonToPost.save();
  res.status(201).send(newPokemon);
});

router.get("/:id", async (req, res) => {
  const targetId = req.params.id;
  const pokemonToGet = await BasicPokemon.findOne({ id: targetId });
  res.status(200).send(pokemonToGet);
});

router.put("/:id", async (req, res) => {
  const targetId = req.params.id;
  const infoToReplace = req.body;
  const pokemonToPut = await BasicPokemon.findOneAndReplace(
    { id: targetId },
    infoToReplace,
    { new: true }
  );
  res.status(200).send(pokemonToPut);
});

router.patch("/:id", async (req, res) => {
  const targetId = req.params.id;
  const infoToUpdate = req.body;
  const pokemonToPatch = await BasicPokemon.findOneAndUpdate(
    { id: targetId },
    infoToUpdate,
    { new: true }
  );
  res.status(200).send(pokemonToPatch);
});

router.delete("/:id", async (req, res) => {
  const targetId = req.params.id;
  const pokemonToDelete = await BasicPokemon.findOneAndDelete( {id: targetId });
  res.status(200).send(pokemonToDelete);
});

module.exports = router;
