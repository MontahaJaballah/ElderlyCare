const express = require('express');
const { connectDB, PORT } = require('./config/db');
const { registerWithEureka, sendHeartbeat } = require('./config/eureka');

const app = express();
app.use(express.json());

// Connect to MongoDB
connectDB();

// Register with Eureka
registerWithEureka();
setInterval(sendHeartbeat, 30 * 1000); // Send heartbeat every 30 seconds

// Mount routes
app.use('/api/users', require('./user/userRoutes'));

app.listen(PORT, () => {
  console.log(`🚀 User service running at http://localhost:${PORT}`);
});
