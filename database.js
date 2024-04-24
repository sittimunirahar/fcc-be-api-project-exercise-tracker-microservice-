require('dotenv').config()
let mongoose = require('mongoose')

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_DB_URI)
    console.log('Database connection successful')
  } catch (err) {
    console.error('Database connection error:', err)
    process.exit(1) // Exit the process on failure
  }
};

module.exports = connectDB