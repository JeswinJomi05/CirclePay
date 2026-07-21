import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';

// Load environment variables
dotenv.config();

// Initialize application
const app = express();
const PORT = process.env.PORT || 5000;

// Connect to Database
connectDB();

// Global Middleware
app.use(cors());
app.use(express.json()); // Parses incoming JSON payloads

// Test Route
app.get('/', (req, res) => {
  res.send('MERN Backend API is running smoothly.');
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`);
});
