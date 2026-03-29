// Vercel Serverless Function - Products API
import { createClient } from '@vercel/postgres';

const client = createClient(process.env.POSTGRES_URL);

export default async function handler(req, res) {
  try {
    // Handle different HTTP methods
    switch (req.method) {
      case 'GET':
        await handleGet(req, res);
        break;
      case 'POST':
        await handlePost(req, res);
        break;
      default:
        res.setHeader('Allow', 'GET, POST');
        res.status(405).end('Method Not Allowed');
    }
  } catch (error) {
    console.error('Products API Error:', error);
    res.status(500).json({ message: 'Error fetching products', error: error.message });
  }
}

async function handleGet(req, res) {
  try {
    const result = await client.query('SELECT * FROM products ORDER BY name');
    res.json(result.rows);
  } catch (error) {
    throw error;
  }
}

async function handlePost(req, res) {
  try {
    const { name, price, unit } = req.body;
    
    if (!name || !price || !unit) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const result = await client.query(
      'INSERT INTO products (name, price, unit) VALUES ($1, $2, $3) RETURNING *',
      [name, price, unit]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    throw error;
  }
}
