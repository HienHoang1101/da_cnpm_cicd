import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import seedAdminUser from "./utils/seedAdmin.js";
import app from "./app.js";

dotenv.config();

const PORT = process.env.PORT || 5001;
mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    if (process.env.AUTO_SEED_ADMIN === "true") {
      try {
        await seedAdminUser();
        console.log("Admin user check completed");
      } catch (error) {
        console.error("Error checking admin user:", error.message);
      }
    }
    app.listen(PORT, () => {
      console.log(`Auth service running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });
