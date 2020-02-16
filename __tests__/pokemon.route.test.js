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
      expect(response).toMatchObject(expectedPokemon);
    });

    it("POST / should return pokemon that has been posted", async () => {
      const expectedPokemon = {
        id: 3,
        name: "Charmander",
        japaneseName: "ヒトカゲ",
        baseHP: 39,
        category: "Tiny Lizard Pokemon"
      };
      const { body: response } = await request(app)
        .post("/pokemon")
        .send(expectedPokemon)
        .expect(201);
      expect(response).toMatchObject(expectedPokemon);
    });

    describe("/pokemon/:id", () => {
      it("GET / should return Pokemon with corresponding ID", async () => {
        const expectedPokemon = {
          id: 2,
          name: "Squirtle",
          japaneseName: "ゼニガメ",
          baseHP: 44,
          category: "Tiny Turtle Pokemon"
        };
        const { body: response } = await request(app)
          .get(`/pokemon/${expectedPokemon.id}`)
          .expect(200);
        expect(response).toMatchObject(expectedPokemon);
      });

      it("PATCH / should return Pokemon with updated details", async () => {
        const expectedPokemon = {
          id: 1,
          category: "Tiny Mouse Pokemon"
        };
        const { body: response } = await request(app)
          .patch(`/pokemon/${expectedPokemon.id}`)
          .send(expectedPokemon)
          .expect(200);
        expect(response.category).toEqual(expectedPokemon.category);
      });
    });
  });
});
