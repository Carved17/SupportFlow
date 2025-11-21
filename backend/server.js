const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const mongoose = require("mongoose");

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(cors({
  origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
  credentials: true
}));
app.use(express.json());

// Connect to Database
connectDB();

// Routes
app.use("/api/tickets", require("./routes/ticketRoutes"));

// Health check endpoint
app.get("/api/health", (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? "Connected" : "Disconnected";
  
  res.json({ 
    message: "Customer Support System API", 
    timestamp: new Date().toISOString(),
    database: dbStatus,
    version: "1.0.0"
  });
});

// Test data initialization endpoint
app.post("/api/init-data", async (req, res) => {
  try {
    const Ticket = require("./models/ticket");
    
    // Clear existing tickets
    await Ticket.deleteMany({});
    
    // Insert sample tickets
    const sampleTickets = [
      {
        title: "Login Issue - Cannot access account",
        description: "Users are unable to login with correct credentials. Getting authentication error.",
        priority: "High",
        status: "Open",
        category: "Technical",
        customerEmail: "john.doe@example.com",
        customerName: "John Doe"
      },
      {
        title: "Payment Gateway Error", 
        description: "Payment transactions are failing during checkout process with error code 500.",
        priority: "High",
        status: "In Progress",
        category: "Billing",
        customerEmail: "sarah.smith@company.com",
        customerName: "Sarah Smith"
      },
      {
        title: "Feature Request - Dark Mode",
        description: "Request to implement dark mode theme for better user experience during night time usage.",
        priority: "Low", 
        status: "Open",
        category: "Feature Request",
        customerEmail: "alex.rodriguez@user.com",
        customerName: "Alex Rodriguez"
      }
    ];
    
    const createdTickets = await Ticket.insertMany(sampleTickets);
    
    res.json({
      message: "Sample data initialized successfully",
      ticketsCreated: createdTickets.length,
      tickets: createdTickets
    });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Error handling middleware
app.use(require("./middleware/errorHandler"));

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🗄️  Database: MongoDB`);
});