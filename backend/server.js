const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const path = require("path");

dotenv.config();

const app = express();

// FIX: Update CORS to allow frontend connections
app.use(cors({
    origin: true, // Allow all origins for testing
    credentials: true
}));

app.use(express.json());

// Serve static files from frontend
app.use(express.static(path.join(__dirname, '../frontend')));

// API Routes
app.use("/api/tickets", require("./routes/ticketRoutes"));

// Test route
app.get("/api/health", (req, res) => {
  res.json({ 
    message: "Server is running", 
    timestamp: new Date().toISOString(),
    database: "MongoDB connected"
  });
});

// Serve frontend routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

app.get('/view-tickets', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/view-tickets.html'));
});

app.get('/create-ticket', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/create-ticket.html'));
});

app.get('/ticket-details', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/ticket-details.html'));
});

// Error handling middleware
app.use(require("./middleware/errorHandler"));

// Only start server if not in test environment and not imported
if (process.env.NODE_ENV !== 'test' && require.main === module) {
  connectDB();
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () =>
    console.log(`Server running on port ${PORT}`)
  );
}

module.exports = app;