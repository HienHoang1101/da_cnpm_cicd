import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import dotenv from "dotenv";

dotenv.config();
const app = express();

import notificationRoutes from "./routes/notificationRoutes.js";

// require CommonJS monitoring module
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const monitoring = require('../monitoring/metrics-middleware.js');
const metricsMiddleware = monitoring.metricsMiddleware;
const client = monitoring.client;

app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());

// register metrics
app.use(metricsMiddleware('notification-service'));

app.use('/api/notifications', notificationRoutes);

app.get('/health', (req, res) => res.status(200).json({ status: 'ok', service: 'notification-service' }));

app.get('/metrics', async (req, res) => {
  try {
    res.set('Content-Type', client.register.contentType);
    res.end(await client.register.metrics());
  } catch (err) {
    res.status(500).end(err.message);
  }
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Something went wrong!', error: process.env.NODE_ENV === 'production' ? 'Server error' : err.message });
});

app.use((req, res) => res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` }));

export default app;
