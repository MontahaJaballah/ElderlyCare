const express = require('express');
const cors = require('cors');
const { connectDB, PORT } = require('./config/db');
const { registerWithEureka, sendHeartbeat } = require('./config/eureka');
const { jwtAuth, requireRole, requireAdmin } = require('./keycloak-config');

const app = express();

// Enable CORS with specific options
app.use(cors({
  origin: ['http://localhost:4200', 'http://localhost:4201', 'http://localhost:4202'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200
}));

// Handle OPTIONS preflight requests
app.options('*', cors());

app.use(express.json());

// Connect to MongoDB
connectDB();

// Register with Eureka
registerWithEureka();
setInterval(sendHeartbeat, 30 * 1000); // Send heartbeat every 30 seconds

// Configure routes with authentication middleware

// Public health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'UP', service: 'user-service' });
});

// Mount routes - public routes don't need protection
app.use('/api/auth', require('./user/fixedRoutes'));

// Protected routes - require authentication
app.use('/api/users', jwtAuth, require('./user/userRoutes'));

// Admin-only routes
app.use('/api/admin', jwtAuth, requireAdmin, (req, res) => {
  res.json({ message: 'Admin access granted', user: req.user });
});

app.listen(PORT, () => {
  console.log(`🚀 User service running at http://localhost:${PORT}`);
});
