const request = require("supertest");
const app = require("../src/app");

describe("app", () => {
  describe("/", () => {
    it("GET / should return all available API endpoints", async () => {
      const apiEndpoints = require("../src/data/apiEndpoints.js");
      const { body: response } = await request(app)
        .get("/")
        .expect(200)
        .send(apiEndpoints);
      expect(response).toMatchObject(apiEndpoints);
    });
  });
});
