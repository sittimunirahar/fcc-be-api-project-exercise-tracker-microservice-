// Defines database connection
// This class is a singleton (single instance) of Database class
let mongoose = require('mongoose')

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb+srv://sitti:sitti_mongodb@cluster0.zxchbn0.mongodb.net/fcc-mongodb-and-mongoose?retryWrites=true&w=majority&appName=Cluster0')
    console.log('Database connection successful')
  } catch (err) {
    console.error('Database connection error:', err)
    process.exit(1) // Exit the process on failure
  }
};

module.exports = connectDB