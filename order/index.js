import mongoose from "mongoose";
import http from "http";
import app from "./app.js";
import { setupWebSocket } from "./websocket.js";

// Create HTTP server for WebSocket support using exported app
const server = http.createServer(app);

const PORT = process.env.PORT || 5002;
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    // Initialize and setup WebSocket server
    const wss = setupWebSocket(server);

    // Start HTTP server
    server.listen(PORT, () => {
      console.log(`Order Service is running on port ${PORT}`);
      console.log(`WebSocket server is running on ws://localhost:${PORT}/ws/orders/:id`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });
