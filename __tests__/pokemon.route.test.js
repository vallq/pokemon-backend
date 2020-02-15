const express = require("express");
const request = require("supertest");
const app = require("../src/app");

describe("pokemon", () => {
  describe("/", () => {
    it("GET / should return all pokemon", async () => {
      const pokemonData = require("../src/data/pokemonData");
      const { body: response } = await request(app)
        .get("/")
        .expect(200);
      expect(response).toMatchObject(pokemonData);
    });
  });
});
