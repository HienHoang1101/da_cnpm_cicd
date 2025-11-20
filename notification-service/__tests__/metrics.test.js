import request from "supertest";
import app from "../app.js";

describe("Notification service metrics endpoint", () => {
  it("should expose /metrics with 200 and prometheus content type", async () => {
    const res = await request(app).get("/metrics");
    expect(res.status).toBe(200);
    expect(res.headers["content-type"]).toMatch(/text\/plain/);
    expect(res.text).toContain("# HELP");
  });
});
