// Vercel Serverless Function - Orders API (Optimized)
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
      const result = await client.query(`
        SELECT 
          o.id,
          o.customer_name,
          o.phone,
          o.address,
          o.total_amount,
          o.created_at,
          COALESCE(
            JSON_AGG(
              JSON_BUILD_OBJECT(
                'product_name', oi.product_name,
                'quantity', oi.quantity,
                'price', oi.price
              )
            ) FILTER (WHERE oi.id IS NOT NULL), 
            '[]'
          ) as items
        FROM orders o
        LEFT JOIN order_items oi ON o.id = oi.order_id
        GROUP BY o.id, o.customer_name, o.phone, o.address, o.total_amount, o.created_at
        ORDER BY o.created_at DESC
      `);
      
      return res.json(result.rows);
    }
    
    if (req.method === 'POST') {
      const { customerName, phone, address, items, totalAmount } = req.body;
      
      if (!customerName || !phone || !address || !items || !totalAmount) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      // Start transaction
      await client.query('BEGIN');

      try {
        // Insert order
        const orderResult = await client.query(
          `INSERT INTO orders (customer_name, phone, address, total_amount) 
           VALUES ($1, $2, $3, $4) RETURNING id, customer_name, phone, address, total_amount, created_at`,
          [customerName, phone, address, parseFloat(totalAmount)]
        );

        const orderId = orderResult.rows[0].id;

        // Insert order items in batch
        const itemValues = items.map((item, index) => 
          `($1, $${index * 3 + 2}, $${index * 3 + 3}, $${index * 3 + 4})`
        ).join(', ');

        const itemParams = [orderId];
        items.forEach(item => {
          itemParams.push(item.productName, item.quantity, parseFloat(item.price));
        });

        await client.query(
          `INSERT INTO order_items (order_id, product_name, quantity, price) 
           VALUES ${itemValues}`,
          itemParams
        );

        await client.query('COMMIT');

        // Return complete order
        const completeOrder = {
          ...orderResult.rows[0],
          items: items
        };

        return res.status(201).json(completeOrder);
      } catch (error) {
        await client.query('ROLLBACK');
        throw error;
      }
    }
    
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Orders API Error:', error.message);
    return res.status(500).json({ error: 'Server error' });
  } finally {
    await client.end();
  }
}
