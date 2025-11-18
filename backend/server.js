const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/tickets", require("./routes/ticketRoutes"));

// Test route
app.get("/api/health", (req, res) => {
  res.json({ 
    message: "Server is running", 
    timestamp: new Date().toISOString(),
    database: "MongoDB connected"
  });
});

// Error handling middleware
app.use(require("./middleware/errorHandler"));

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Only start server if not in test environment and not imported
if (process.env.NODE_ENV !== 'test' && require.main === module) {
  connectDB();
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () =>
    console.log(`Server running on port ${PORT}`)
  );
}

// Export app for testing
module.exports = app;