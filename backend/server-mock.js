const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Mock Data (for testing without MongoDB)
const mockProducts = [
  { _id: '1', name: 'Milk', price: 50, unit: 'Liter' },
  { _id: '2', name: 'Curd', price: 40, unit: '500g' },
  { _id: '3', name: 'Paneer', price: 120, unit: '500g' },
  { _id: '4', name: 'Butter', price: 80, unit: '250g' },
  { _id: '5', name: 'Ghee', price: 200, unit: '500ml' }
];

let mockOrders = [];

// Routes
app.get('/api/products', (req, res) => {
  console.log('Fetching products...');
  res.json(mockProducts);
});

app.post('/api/products', (req, res) => {
  const newProduct = { ...req.body, _id: Date.now().toString() };
  mockProducts.push(newProduct);
  res.status(201).json(newProduct);
});

app.get('/api/orders', (req, res) => {
  console.log('Fetching orders...');
  res.json(mockOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
});

app.post('/api/orders', (req, res) => {
  console.log('Creating new order:', req.body);
  const newOrder = {
    ...req.body,
    _id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  mockOrders.push(newOrder);
  res.status(201).json(newOrder);
});

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Dairy Ordering System API (Mock Mode)' });
});

app.listen(PORT, () => {
  console.log(`🚀 Mock server running on port ${PORT}`);
  console.log('✅ No MongoDB required - using mock data');
  console.log('📦 Available endpoints:');
  console.log('   GET /api/products - Get all products');
  console.log('   POST /api/orders - Create new order');
  console.log('   GET /api/orders - Get all orders');
});
