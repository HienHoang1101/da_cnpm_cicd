import express from "express";
import client from "prom-client";

const router = express.Router();

// Default metrics
const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics({ timeout: 5000 });

// Create a custom counter for handled requests
const httpRequestCounter = new client.Counter({
  name: "payment_service_http_requests_total",
  help: "Total number of HTTP requests handled by the payment service",
  labelNames: ["method", "route", "status_code"],
});

// Middleware to count requests
export const metricsMiddleware = (req, res, next) => {
  res.on("finish", () => {
    httpRequestCounter.inc({ method: req.method, route: req.route?.path || req.path, status_code: res.statusCode }, 1);
  });
  next();
};

// Expose metrics
router.get("/", async (req, res) => {
  try {
    res.set("Content-Type", client.register.contentType);
    res.end(await client.register.metrics());
  } catch (err) {
    res.status(500).end(err.message);
  }
});

export default router;
