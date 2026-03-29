// Vercel Serverless Function - Products API (Optimized)
import { createClient } from '@vercel/postgres';

const client = createClient(process.env.POSTGRES_URL);

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    if (req.method === 'GET') {
      const result = await client.query('SELECT id, name, price, unit FROM products ORDER BY name');
      return res.json(result.rows);
    }
    
    if (req.method === 'POST') {
      const { name, price, unit } = req.body;
      
      if (!name || !price || !unit) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const result = await client.query(
        'INSERT INTO products (name, price, unit) VALUES ($1, $2, $3) RETURNING id, name, price, unit',
        [name, parseFloat(price), unit]
      );
      
      return res.status(201).json(result.rows[0]);
    }
    
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Products API Error:', error.message);
    return res.status(500).json({ error: 'Server error' });
  } finally {
    await client.end();
  }
}
