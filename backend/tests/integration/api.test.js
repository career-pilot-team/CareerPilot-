const request = require("supertest");
const app = require("../../src/app");

describe("Backend API Integration Test", () => {
  test("GET /healthz", async () => {
    const res = await request(app).get("/healthz");

    expect(res.statusCode).toBe(200);
    expect(res.body.ok).toBe(true);
  });
});
