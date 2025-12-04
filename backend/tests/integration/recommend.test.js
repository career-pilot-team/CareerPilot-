const request = require("supertest");
const app = require("../../src/app");  // 서버 객체
const jwt = require("jsonwebtoken");

const TEST_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTcwNjk5MTQ5MywiZXhwIjoxNzA2OTk1MDkzfQ.W3C_efV5HgupX4-9hVfHWuLXfGzlVvL6tovbVvfmFKE"; // 아래에서 바꿔 넣기

describe("Recommend API Integration Test", () => {

  // 1) 상세 추천 API 테스트
  test("POST /api/recommend/detailed → Should return 200", async () => {
    const res = await request(app)
      .post("/api/recommend/detailed")
      .set("Authorization", `Bearer ${TEST_TOKEN}`)
      .send({
        major: "컴퓨터공학",
        interests: ["AI", "Security"],
        desiredRole: "Backend",
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("result");
  });

  // 2) 추천 결과 저장 테스트
  test("POST /api/recommend/save → Should return 200", async () => {
    const res = await request(app)
      .post("/api/recommend/save")
      .set("Authorization", `Bearer ${TEST_TOKEN}`)
      .send({
        result: {
          role: "Backend Developer",
          skills: ["Node.js", "DB", "Git"],
        },
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("message");
  });

  // 3) 저장된 추천 결과 조회 테스트
  test("GET /api/recommend/result → Should return 200", async () => {
    const res = await request(app)
      .get("/api/recommend/result")
      .set("Authorization", `Bearer ${TEST_TOKEN}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("latestResult");
  });
});
