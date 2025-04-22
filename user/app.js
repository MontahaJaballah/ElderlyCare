const express = require('express');
const cors = require('cors');
const { connectDB, PORT } = require('./config/db');
const { registerWithEureka, sendHeartbeat } = require('./config/eureka');

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

// Mount routes
app.use('/api', require('./user/fixedRoutes'));

app.listen(PORT, () => {
  console.log(`🚀 User service running at http://localhost:${PORT}`);
});
