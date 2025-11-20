import request from "supertest";

// Prevent mongoose from connecting during tests by not importing index.js
process.env.NODE_ENV = process.env.NODE_ENV || "test";

import app from "../app.js";

describe("Auth service metrics endpoint", () => {
  it("should expose /metrics with 200 and prometheus content type", async () => {
    const res = await request(app).get("/metrics");
    expect(res.status).toBe(200);
    expect(res.headers["content-type"]).toMatch(/text\/plain/);
    expect(res.text).toContain("# HELP");
  });
});
