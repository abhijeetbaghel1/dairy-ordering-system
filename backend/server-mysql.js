const express = require('express');
const cors = require('cors');
const { testConnection, initDatabase } = require('./config/database');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize database
async function startServer() {
  try {
    // Test connection and initialize database
    await testConnection();
    await initDatabase();
    
    // Routes
    app.use('/api/products', require('./routes/products-mysql'));
    app.use('/api/orders', require('./routes/orders-mysql'));
    
    // Basic route
    app.get('/', (req, res) => {
      res.json({ message: 'Dairy Ordering System API - MySQL Version' });
    });
    
    app.listen(PORT, () => {
      console.log(`🚀 MySQL server running on port ${PORT}`);
      console.log('✅ Connected to MySQL database');
      console.log('📦 Available endpoints:');
      console.log('   GET /api/products - Get all products');
      console.log('   POST /api/orders - Create new order');
      console.log('   GET /api/orders - Get all orders');
      console.log('   GET /api/orders/:id - Get specific order');
      console.log('   GET /api/orders/date-range/:start/:end - Get orders by date range');
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
}

startServer();
