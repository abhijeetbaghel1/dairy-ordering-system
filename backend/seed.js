const mongoose = require('mongoose');
const Product = require('./models/Product');

// Sample dairy products
const sampleProducts = [
  { name: 'Milk', price: 50, unit: 'Liter' },
  { name: 'Curd', price: 40, unit: '500g' },
  { name: 'Paneer', price: 120, unit: '500g' },
  { name: 'Butter', price: 80, unit: '250g' },
  { name: 'Ghee', price: 200, unit: '500ml' }
];

// Seed the database
async function seedDatabase() {
  try {
    await mongoose.connect('mongodb://localhost:27017/dairy-ordering');
    
    // Clear existing products
    await Product.deleteMany({});
    
    // Insert sample products
    await Product.insertMany(sampleProducts);
    
    console.log('Database seeded successfully!');
    console.log('Sample products added:', sampleProducts.length);
    
    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding database:', error);
    mongoose.connection.close();
  }
}

seedDatabase();
