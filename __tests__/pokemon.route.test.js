const request = require("supertest");
const app = require("../src/app");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const BasicPokemon = require("../src/models/pokemon.model");

describe("pokemon", () => {
  let mongoServer;
  beforeAll(async () => {
    try {
      mongoServer = new MongoMemoryServer();
      const mongoURI = await mongoServer.getConnectionString();
      const mongoOptions = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false
      };
      await mongoose.connect(mongoURI, mongoOptions);
    } catch (err) {
      console.error(err);
    }
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    const pokemonData = [
      {
        id: 1,
        name: "Pikachu",
        japaneseName: "ピカチュウ",
        baseHP: 35,
        category: "Mouse Pokemon"
      },
      {
        id: 2,
        name: "Squirtle",
        japaneseName: "ゼニガメ",
        baseHP: 44,
        category: "Tiny Turtle Pokemon"
      }
    ];
    await BasicPokemon.create(pokemonData);
  });

  afterEach(async () => {
    jest.resetAllMocks();
    await BasicPokemon.deleteMany();
  });

  describe("/", () => {
    it("GET / should return all pokemon", async () => {
      const pokemonData = require("../src/data/pokemonData");
      const { body: response } = await request(app)
        .get("/pokemon")
        .expect(200);
      expect(response).toMatchObject(pokemonData);
    });

    it("GET / should return pokemon with names that contain search query", async () => {
      const expectedPokemon = [
        {
          id: 1,
          name: "Pikachu",
          japaneseName: "ピカチュウ",
          baseHP: 35,
          category: "Mouse Pokemon"
        }
      ];
      const { body: response } = await request(app)
        .get(`/pokemon?name=chu`)
        .expect(200);
      console.log(response);
      expect(response).toMatchObject(expectedPokemon);
    });
  });
});
