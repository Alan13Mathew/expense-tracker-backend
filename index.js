require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

// Enhanced CORS configuration
app.use(cors({
  origin: 'http://localhost:4200',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Comprehensive request logging
app.use((req, res, next) => {
  console.log('Incoming Request:', {
    method: req.method,
    path: req.path,
    token: req.headers.authorization,
    timestamp: new Date().toISOString()
  });
  next();
});

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/expenses', require('./routes/expense'));

//backend token validation endpoint
app.post('/auth/validate-token', (req, res) => {
  const { token } = req.body;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.status(200).json({ valid: true, user: decoded });
  } catch (error) {
    res.status(401).json({ valid: false, message: 'Invalid or expired token' });
  }
});


// Database connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB Connected Successfully'))
  .catch(err => console.error('MongoDB Connection Error:', err));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
