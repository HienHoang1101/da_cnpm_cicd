import express from "express";
import cors from "cors";
import BodyParser from "body-parser";
import mongoose from "mongoose";
import { MONGOURL, PORT } from "./config.js";
import dotenv from "dotenv";
import { createRequire } from 'module';
import Owner from "./Routes/ResturantOwnerRoute.js";
import Admin from "./routes/branchAdminRoute.js";

const app = express();
dotenv.config();

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

global.gConfig = {
  orders_url: process.env.ORDERS_SERVICE_URL || "http://localhost:5002", // Adjust port as needed
  notification_url: process.env.NOTIFICATION_SERVICE_URL,
};

app.use(express.json());
app.use(BodyParser.json());
app.use(express.urlencoded({ extended: false }));

// Monitoring: register metrics middleware and expose /metrics
try {
  const require = createRequire(import.meta.url);
  const monitoring = require('../monitoring/metrics-middleware.js');
  app.use(monitoring.metricsMiddleware('restaurant-service'));
  app.get('/metrics', async (req, res) => {
    try {
      res.set('Content-Type', monitoring.client.register.contentType);
      res.end(await monitoring.client.register.metrics());
    } catch (err) {
      res.status(500).end(err.message);
    }
  });
} catch (e) {
  console.warn('Monitoring not initialized for restaurant-service', e.message);
}

app.use("/api", Owner);
app.use("/api/branch", Admin);

const startServer = async () => {
  try {
    await mongoose.connect(MONGOURL);
    console.log("✅ Database Connected Successfully");

    const server = app.listen(PORT, () => {
      console.log(`🚀 Server is Running on Port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Error connecting to the database:", error);
  }
};
startServer();
