const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');

dotenv.config();
const app = express();

// Middleware
app.use(express.json()); // Allows API to read JSON from the frontend
app.use(cors());         // Security feature for browser requests
app.use(helmet());       // Standard HTTP header security

// We will import our API routes here shortly!
app.use('/api/auth', require('./routes/authRoutes'));

app.use('/api/alumni', require('./routes/alumniRoutes'));

app.get('/', (req, res) => {
    res.send('PERN Alumni API is online and waiting...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});