import dotenv from "dotenv";
import connectDB from "./config/db.js";
import { startRegistrationConsumer } from "./consumers/notificationConsumer.js";
import app from "./app.js";

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Start Kafka consumer
startRegistrationConsumer();

// Start server
const PORT = process.env.PORT || 5007;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
