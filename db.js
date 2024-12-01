const mongoose = require('mongoose')

// Use environment variable for password
const uri = process.env.MONGODB_URI;



async function connectDB() {
 
  try {
    await mongoose.connect(uri);
    console.log('MongoDb Atlas Connection success!');
    
  } catch (error) {
    console.error("Connection error:", error);
    throw error;
  }

}

module.exports = { connectDB };
