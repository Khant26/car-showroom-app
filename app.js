const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
require("dotenv").config();

const { uploadDir } = require("./middleware/upload");

const app = express();

// Behind Render/Fly/Docker proxies we want correct client IPs and protocol.
app.set("trust proxy", 1);

app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

// Allowed browser origins: CORS_ORIGIN (comma-separated) plus the legacy
// FRONTEND_URL / ADMIN_URL variables. In development, Vite's dev servers are
// allowed too. Requests without an Origin header (curl, health checks) pass.
const parseOrigins = (value) =>
  (value || "")
    .split(",")
    .map((o) => o.trim().replace(/\/+$/, ""))
    .filter(Boolean);

const allowedOrigins = [
  ...parseOrigins(process.env.CORS_ORIGIN),
  ...parseOrigins(process.env.FRONTEND_URL),
  ...parseOrigins(process.env.ADMIN_URL),
];
if (process.env.NODE_ENV !== "production") {
  allowedOrigins.push("http://localhost:5173", "http://localhost:5174");
}

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      const err = new Error("Not allowed by CORS");
      err.status = 403;
      return callback(err);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

if (process.env.NODE_ENV !== "test") {
  app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
}
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Static files for uploads
app.use("/uploads", express.static(uploadDir));

// Health check (no DB required so container/platform probes work).
const health = (req, res) => {
  const dbStates = ["disconnected", "connected", "connecting", "disconnecting"];
  res.status(200).json({
    status: "OK",
    message: "Car Showroom API is running",
    database: dbStates[mongoose.connection.readyState] || "unknown",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
};
app.get("/health", health);
app.get("/api/health", health);

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/banners", require("./routes/banners"));
app.use("/api/brands", require("./routes/brands"));
app.use("/api/cars", require("./routes/cars"));
app.use("/api/sold-cars", require("./routes/soldcars"));
app.use("/api/rentals", require("./routes/rentals"));
app.use("/api/upload", require("./routes/upload"));

// Default route
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to Car Showroom API",
    version: "1.0.0",
    endpoints: {
      health: "/health",
      auth: "/api/auth",
      banners: "/api/banners",
      brands: "/api/brands",
      cars: "/api/cars",
      soldCars: "/api/sold-cars",
      rentals: "/api/rentals",
      upload: "/api/upload",
    },
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Error handling middleware (must be last and keep 4 args)
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  if (process.env.NODE_ENV !== "test") console.error(err.stack || err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Something went wrong!",
    error: process.env.NODE_ENV === "development" ? err.stack : {},
  });
});

module.exports = app;
