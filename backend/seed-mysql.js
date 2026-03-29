const { pool, testConnection, initDatabase } = require('./config/database');

// Sample dairy products
const sampleProducts = [
  { name: 'Milk', price: 50.00, unit: 'Liter' },
  { name: 'Curd', price: 40.00, unit: '500g' },
  { name: 'Paneer', price: 120.00, unit: '500g' },
  { name: 'Butter', price: 80.00, unit: '250g' },
  { name: 'Ghee', price: 200.00, unit: '500ml' }
];

// Seed the database
async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');
    
    // Test connection and initialize database
    await testConnection();
    await initDatabase();
    
    // Clear existing products
    await pool.query('DELETE FROM products');
    console.log('🧹 Cleared existing products');
    
    // Insert sample products
    for (let product of sampleProducts) {
      await pool.query(
        'INSERT INTO products (name, price, unit) VALUES (?, ?, ?)',
        [product.name, product.price, product.unit]
      );
    }
    
    console.log('✅ Database seeded successfully!');
    console.log('📦 Sample products added:', sampleProducts.length);
    console.log('\n📋 Products added:');
    sampleProducts.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name} - ₹${product.price}/${product.unit}`);
    });
    
    // Show database structure
    console.log('\n🗄️ Database tables created:');
    console.log('1. products - Dairy products catalog');
    console.log('2. orders - Customer orders');
    console.log('3. order_items - Individual items in each order');
    
    console.log('\n🎉 Ready to use MySQL database!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
    process.exit(1);
  }
}

seedDatabase();
