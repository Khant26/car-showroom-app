require("dotenv").config();
const mongoose = require("mongoose");
const app = require("./app");
const { runStartupTasks } = require("./seed");

const PORT = Number(process.env.PORT) || 5001;
const HOST = process.env.HOST || "0.0.0.0";
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/carshowroom_new";

if (!process.env.JWT_SECRET) {
  console.error("JWT_SECRET is not set. Copy .env.example to .env and set it.");
  process.exit(1);
}

const server = app
  .listen(PORT, HOST, () => {
    console.log(`Server listening on http://${HOST}:${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
    console.log(`Health check: /health`);
  })
  .on("error", (err) => {
    console.error("Server error:", err);
    if (err.code === "EADDRINUSE") {
      console.log(`Port ${PORT} is already in use. Please try a different port.`);
    }
    process.exit(1);
  });

mongoose
  .connect(MONGODB_URI, {
    serverSelectionTimeoutMS: Number(process.env.MONGODB_TIMEOUT_MS) || 10000,
  })
  .then(async (conn) => {
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    // Admin bootstrap + optional demo seed (SEED_DEMO=1). Failures are logged
    // but do not stop the API.
    try {
      await runStartupTasks();
    } catch (err) {
      console.error("Startup seeding failed:", err.message);
    }
  })
  .catch((error) => {
    console.error("Database connection error:", error.message);
    process.exit(1);
  });

const shutdown = (signal) => {
  console.log(`${signal} received, shutting down`);
  server.close(() => {
    mongoose.connection.close(false).finally(() => process.exit(0));
  });
};
process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
