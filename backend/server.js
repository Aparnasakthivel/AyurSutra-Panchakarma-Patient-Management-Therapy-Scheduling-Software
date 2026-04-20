const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Import database connection
const connectDB = require("./config/db");

// Import routes
const patientRoutes = require("./routes/patients");
const doctorRoutes = require("./routes/doctors");
const therapyRoutes = require("./routes/therapies");
const adminRoutes = require("./routes/admins");
const stockRoutes = require("./routes/stock");
const reportRoutes = require("./routes/reports");
const billingRoutes = require("./routes/billing");
const reminderRoutes = require("./routes/new_reminders");

// Health check endpoint
app.get("/", (req, res) => {
  res.json({
    status: "ok",
    message: "Panchakarma Therapy Backend Running",
    timestamp: new Date().toISOString(),
    mongodb: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
  });
});

// Health check with detailed info
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    mongodb: {
      connected: mongoose.connection.readyState === 1,
      host: mongoose.connection.host || "N/A",
      database: mongoose.connection.name || "N/A",
    },
  });
});

// API Routes
app.use("/api/patients", patientRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/therapies", therapyRoutes);
app.use("/api/admins", adminRoutes);
app.use("/api/stock", stockRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/billing", billingRoutes);
app.use("/api/reminders", reminderRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(err.status || 500).json({
    error: err.message || "Internal server error",
    details: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Connect to MongoDB and start server
const startServer = async () => {
  try {
    await connectDB();
    console.log("✓ MongoDB connected");

    // Reschedule any pending reminders
    if (reminderRoutes && typeof reminderRoutes._reschedulePending === 'function') {
      try { reminderRoutes._reschedulePending(); } catch (err) { console.error('Reschedule failed', err); }
    }

    app.listen(PORT, () => {
      console.log(`✓ Server running on http://localhost:${PORT}`);
      console.log(`✓ API Documentation:`);
      console.log(`  - Patients: GET/POST http://localhost:${PORT}/api/patients`);
      console.log(`  - Doctors: GET/POST http://localhost:${PORT}/api/doctors`);
      console.log(`  - Therapies: GET/POST http://localhost:${PORT}/api/therapies`);
      console.log(`  - Stock: GET/POST http://localhost:${PORT}/api/stock`);
      console.log(`  - Reports: GET/POST http://localhost:${PORT}/api/reports`);
      console.log(`  - Billing: GET/POST http://localhost:${PORT}/api/billing`);
      console.log(`  - Admins: GET/POST http://localhost:${PORT}/api/admins`);
      console.log(`  - Reminders: POST http://localhost:${PORT}/api/reminders`);
      console.log(`  - Health Check: GET http://localhost:${PORT}/api/health`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();

// Vendor order endpoint: called when stock is low
app.post("/api/vendor-orders", async (req, res) => {
  const { medicine, currentQty } = req.body;

  if (!medicine || typeof currentQty === "undefined") {
    return res.status(400).json({ error: "medicine and currentQty are required" });
  }

  // In a real app you would integrate with vendor API / send email here.
  console.log("Placing vendor order for:", {
    medicine,
    currentQty,
    requestedAt: new Date().toISOString(),
  });

  try {
    return res.json({
      success: true,
      message: `Vendor order triggered for ${medicine}`,
    });
  } catch (err) {
    console.error("Error creating vendor order", err);
    return res
      .status(500)
      .json({ error: "Failed to create vendor order", details: err.message });
  }
});

// Server is started in startServer(); no direct listen here.

