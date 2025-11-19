import request from "supertest";

// Provide minimal env vars to avoid initializers (Stripe) failing during tests
process.env.STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || "sk_test_dummy_for_tests";
process.env.STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || "whsec_dummy_for_tests";

import app from "../app.js";

describe("Metrics endpoint", () => {
  it("should expose /metrics with 200 and prometheus content type", async () => {
    const res = await request(app).get("/metrics");
    expect(res.status).toBe(200);
    expect(res.headers["content-type"]).toMatch(/text\/plain/);
    expect(res.text).toContain("# HELP");
  });
});
