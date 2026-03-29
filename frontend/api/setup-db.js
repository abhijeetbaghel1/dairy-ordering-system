// Database setup script for Vercel Postgres (Optimized)
import { createClient } from '@vercel/postgres';

const client = createClient(process.env.POSTGRES_URL);

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Create tables with optimized schema
    await client.query(`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        unit VARCHAR(50) NOT NULL
      )
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        customer_name VARCHAR(255) NOT NULL,
        phone VARCHAR(20) NOT NULL,
        address TEXT NOT NULL,
        total_amount DECIMAL(10, 2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS order_items (
        id SERIAL PRIMARY KEY,
        order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
        product_name VARCHAR(255) NOT NULL,
        quantity INTEGER NOT NULL,
        price DECIMAL(10, 2) NOT NULL
      )
    `);

    // Clear existing products
    await client.query('DELETE FROM products');
    
    // Insert sample products in batch
    const sampleProducts = [
      ['Milk', 50.00, 'Liter'],
      ['Curd', 40.00, '500g'],
      ['Paneer', 120.00, '500g'],
      ['Butter', 80.00, '250g'],
      ['Ghee', 200.00, '500ml']
    ];

    const values = sampleProducts.map((_, index) => 
      `($${index * 3 + 1}, $${index * 3 + 2}, $${index * 3 + 3})`
    ).join(', ');

    const params = sampleProducts.flat();
    
    await client.query(
      `INSERT INTO products (name, price, unit) VALUES ${values}`,
      params
    );

    return res.json({ 
      success: true,
      message: 'Database setup completed successfully',
      productsAdded: sampleProducts.length
    });
  } catch (error) {
    console.error('Database setup error:', error.message);
    return res.status(500).json({ 
      success: false,
      error: 'Database setup failed',
      details: error.message 
    });
  } finally {
    await client.end();
  }
}
