const express = require('express');
const { connectDB, PORT } = require('./config/db');

const app = express();
app.use(express.json());

// Connect to MongoDB
connectDB();

// Mount routes
app.use('/api/users', require('./user/userRoutes'));

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
