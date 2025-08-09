const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const session = require('express-session');
const passport = require('passport');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const teamRoutes = require('./routes/teams');
const matchmakingRoutes = require('./routes/matchmaking');
const raiderioRoutes = require('./routes/raiderio');
const leaderboardRoutes = require('./routes/leaderboard');

require('./config/passport');

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());

// Dynamic CORS configuration for development
const getCorsOrigin = () => {
  if (process.env.CLIENT_URL) {
    return process.env.CLIENT_URL;
  }
  
  // In development, allow any origin that uses port 3000
  if (process.env.NODE_ENV !== 'production') {
    return (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      
      // Allow any origin that ends with :3000 (for IP access)
      if (origin.endsWith(':3000')) {
        return callback(null, true);
      }
      
      // Allow localhost variations
      if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
        return callback(null, true);
      }
      
      callback(new Error('Not allowed by CORS'));
    };
  }
  
  return 'http://localhost:3000';
};

app.use(cors({
  origin: getCorsOrigin(),
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session middleware
app.use(session({
  secret: process.env.SESSION_SECRET || 'fallback-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/matchmaking', matchmakingRoutes);
app.use('/api/raiderio', raiderioRoutes);
app.use('/api/leaderboard', leaderboardRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: process.env.NODE_ENV === 'production' 
      ? 'Something went wrong!' 
      : err.message
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Server accessible at:`);
  console.log(`  - Local: http://localhost:${PORT}`);
  console.log(`  - Network: http://0.0.0.0:${PORT}`);
}); 