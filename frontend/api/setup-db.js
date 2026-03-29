// Database setup script for Vercel Postgres
import { createClient } from '@vercel/postgres';

const client = createClient(process.env.POSTGRES_URL);

export default async function handler(req, res) {
  try {
    // Create tables
    await client.query(`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        unit VARCHAR(50) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        customer_name VARCHAR(255) NOT NULL,
        phone VARCHAR(20) NOT NULL,
        address TEXT NOT NULL,
        total_amount DECIMAL(10, 2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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

    // Insert sample products
    await client.query('DELETE FROM products');
    
    const sampleProducts = [
      ['Milk', 50.00, 'Liter'],
      ['Curd', 40.00, '500g'],
      ['Paneer', 120.00, '500g'],
      ['Butter', 80.00, '250g'],
      ['Ghee', 200.00, '500ml']
    ];

    for (const [name, price, unit] of sampleProducts) {
      await client.query(
        'INSERT INTO products (name, price, unit) VALUES ($1, $2, $3)',
        [name, price, unit]
      );
    }

    res.json({ 
      message: 'Database setup completed successfully',
      productsAdded: sampleProducts.length
    });
  } catch (error) {
    console.error('Database setup error:', error);
    res.status(500).json({ message: 'Database setup failed', error: error.message });
  }
}
