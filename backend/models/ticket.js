const mongoose = require("mongoose");

const TicketSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: [true, "Title is required"],
    trim: true
  },
  description: { 
    type: String, 
    required: [true, "Description is required"],
    trim: true
  },
  priority: { 
    type: String, 
    enum: ["Low", "Medium", "High"],
    default: "Medium" 
  },
  status: { 
    type: String, 
    enum: ["Open", "In Progress", "Resolved", "Closed"],
    default: "Open" 
  },
  category: {
    type: String,
    default: "General"
  },
  customerEmail: { 
    type: String,
    required: [true, "Customer email is required"],
    trim: true,
    lowercase: true
  },
  customerName: {
    type: String,
    trim: true
  },
  assignedTo: {
    type: String,
    trim: true
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Update updatedAt before saving
TicketSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("Ticket", TicketSchema);