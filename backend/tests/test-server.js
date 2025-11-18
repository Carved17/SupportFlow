const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// Import routes and controllers
app.use("/api/tickets", require("../routes/ticketRoutes"));

// Test route
app.get("/api/health", (req, res) => {
  res.json({ 
    message: "Test server is running", 
    timestamp: new Date().toISOString(),
    database: "In-memory MongoDB"
  });
});

// Error handling middleware
app.use(require("../middleware/errorHandler"));

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

module.exports = app;