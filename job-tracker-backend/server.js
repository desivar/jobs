// Load environment variables from .env file
require('dotenv').config(); 

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5500; // Use process.env.PORT if available, otherwise default to 3000

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Enable JSON body parsing

// MongoDB Connection
// Now using the MONGODB_URI from the .env file
const MONGODB_URI = process.env.MONGODB_URI; 

// Check if MONGODB_URI is loaded
if (!MONGODB_URI) {
  console.error('Error: MONGODB_URI is not defined. Please check your .env file.');
  process.exit(1); // Exit if URI is missing
}

mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB successfully!'))
  .catch((error) => {
    console.error('MongoDB connection error:', error);
    // Exit process if MongoDB connection fails
    process.exit(1); 
  });

// Simple Mongoose Schemas (adjust fields as needed based on your data structure)
const userSchema = new mongoose.Schema({}, { strict: false, collection: 'users' });
const customerSchema = new mongoose.Schema({}, { strict: false, collection: 'customers' });
const jobSchema = new mongoose.Schema({}, { strict: false, collection: 'jobs' });
const pipelineSchema = new mongoose.Schema({}, { strict: false, collection: 'pipelines' });

// Models
const User = mongoose.model('User', userSchema);
const Customer = mongoose.model('Customer', customerSchema);
const Job = mongoose.model('Job', jobSchema);
const Pipeline = mongoose.model('Pipeline', pipelineSchema);

// Routes to fetch all data from respective collections
// GET all users
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users from database.' });
  }
});

// GET all customers
app.get('/api/customers', async (req, res) => {
  try {
    const customers = await Customer.find({});
    res.json(customers);
  } catch (error) {
    console.error('Error fetching customers:', error);
    res.status(500).json({ error: 'Failed to fetch customers from database.' });
  }
});

// GET all jobs
app.get('/api/jobs', async (req, res) => {
  try {
    const jobs = await Job.find({});
    res.json(jobs);
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({ error: 'Failed to fetch jobs from database.' });
  }
});

// GET all pipelines
app.get('/api/pipelines', async (req, res) => {
  try {
    const pipelines = await Pipeline.find({});
    res.json(pipelines);
  } catch (error) {
    console.error('Error fetching pipelines:', error);
    res.status(500).json({ error: 'Failed to fetch pipelines from database.' });
  }
});

// Test route to confirm backend is running
app.get('/', (req, res) => {
  res.json({ 
    message: 'MongoDB Backend API is running!',
    endpoints: [
      'GET /api/users',
      'GET /api/customers', 
      'GET /api/jobs',
      'GET /api/pipelines'
    ]
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Access test route at: http://localhost:${PORT}`);
});

module.exports = app;
