const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    // Don't connect to real DB in test environment
    if (process.env.NODE_ENV === 'test') {
      console.log("Skipping MongoDB connection in test environment");
      return; // Tests will handle their own in-memory connection
    }
    
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected");
  } catch (err) {
    console.log("MongoDB Connection Error:", err);
    process.exit(1);
  }
};

module.exports = connectDB;