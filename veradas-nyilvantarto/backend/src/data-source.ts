import mongoose from 'mongoose';

const MONGO_URI = 'mongodb://localhost:27017/veradas'; // Update with your MongoDB URI

const connectToMongoDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB successfully!');
    return mongoose.connection;
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};

export default connectToMongoDB;
