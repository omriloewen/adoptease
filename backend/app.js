const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import the CORS middleware
const candidateRoutes = require('./routes/candidateRoutes');
const { connectDB } = require('./config/db');
const Candidate = require('./models/candidateModel');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const dogRoutes = require('./routes/dogRoutes');
const User = require('./models/userModel'); 
const Dog = require('./models/dogModel');
const protect = require('./middleware/authMiddleware');

const app = express();

require('dotenv').config();
connectDB();

Candidate.sync({ alter: true })
  .then(() => console.log('Candidate table synced with the database'))
  .catch(error => console.error('Error syncing Candidate table:', error));

  // Sync User table with the database
User.sync({ alter: true })
.then(() => console.log('User table synced with the database'))
.catch(error => console.error('Error syncing User table:', error));

Dog.sync({ alter: true })
.then(() => console.log('Dog table synced with the database'))
.catch(error => console.error('Error syncing Dog table:', error));


// Enable CORS for all origins (or restrict to specific origins)
app.use(cors({
  origin: 'http://localhost:3000',  // Allow requests from your frontend (React) running on this port
  methods: ['GET', 'POST', 'PUT', 'DELETE'],         // Allow only GET and POST requests
}));

// Middleware to parse incoming JSON
app.use(bodyParser.json());

// Mount candidate routes
app.use('/api/candidates', candidateRoutes);

// Authentication routes
app.use('/api/auth', authRoutes);

app.use('/api/users', userRoutes);

app.use('/api/dogs', dogRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));