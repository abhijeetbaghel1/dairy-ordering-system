// Vercel Serverless Function - Orders API
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
    console.error('Orders API Error:', error);
    res.status(500).json({ message: 'Error handling orders', error: error.message });
  }
}

async function handleGet(req, res) {
  try {
    const result = await client.query(`
      SELECT 
        o.*,
        JSON_AGG(
          JSON_BUILD_ARRAY(
            JSON_BUILD_OBJECT(
              'product_name', oi.product_name,
              'quantity', oi.quantity,
              'price', oi.price
            )
          )
        ) as items
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      ORDER BY o.created_at DESC
    `);
    
    // Format the response to match expected structure
    const orders = result.rows.map(order => ({
      ...order,
      items: order.items
    }));
    
    res.json(orders);
  } catch (error) {
    throw error;
  }
}

async function handlePost(req, res) {
  try {
    const { customerName, phone, address, items, totalAmount } = req.body;
    
    if (!customerName || !phone || !address || !items || !totalAmount) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Start transaction
    await client.query('BEGIN');

    try {
      // Insert order
      const orderResult = await client.query(
        `INSERT INTO orders (customer_name, phone, address, total_amount) 
         VALUES ($1, $2, $3, $4) RETURNING *`,
        [customerName, phone, address, totalAmount]
      );

      const orderId = orderResult.rows[0].id;

      // Insert order items
      for (const item of items) {
        await client.query(
          `INSERT INTO order_items (order_id, product_name, quantity, price) 
             VALUES ($1, $2, $3, $4)`,
          [orderId, item.productName, item.quantity, item.price]
        );
      }

      await client.query('COMMIT');

      // Return complete order with items
      const completeOrder = {
        ...orderResult.rows[0],
        items: items
      };

      res.status(201).json(completeOrder);
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    }
  } catch (error) {
    throw error;
  }
}
