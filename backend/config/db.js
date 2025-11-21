const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    // Use explicit localhost IP for Codespaces compatibility
    const mongoURI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/support_system";
    
    console.log("Connecting to MongoDB...");
    
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log("✅ MongoDB Connected Successfully");
  } catch (err) {
    console.log("❌ MongoDB Connection Error:", err.message);
    console.log("💡 Make sure MongoDB is running: sudo systemctl start mongodb");
    process.exit(1);
  }
};

module.exports = connectDB;