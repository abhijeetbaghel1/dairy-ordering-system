const { pool } = require('../config/database');

class Order {
  // Get all orders with items
  static async getAll() {
    try {
      const [orders] = await pool.query(`
        SELECT * FROM orders 
        ORDER BY created_at DESC
      `);
      
      // Get items for each order
      for (let order of orders) {
        const [items] = await pool.query(`
          SELECT product_name, quantity, price 
          FROM order_items 
          WHERE order_id = ?
        `, [order.id]);
        
        order.items = items;
      }
      
      return orders;
    } catch (error) {
      throw new Error('Error fetching orders: ' + error.message);
    }
  }

  // Create new order with items
  static async create(orderData) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
      
      // Insert order
      const { customerName, phone, address, items, totalAmount } = orderData;
      const [orderResult] = await connection.query(`
        INSERT INTO orders (customer_name, phone, address, total_amount) 
        VALUES (?, ?, ?, ?)
      `, [customerName, phone, address, totalAmount]);
      
      const orderId = orderResult.insertId;
      
      // Insert order items
      for (let item of items) {
        await connection.query(`
          INSERT INTO order_items (order_id, product_name, quantity, price) 
          VALUES (?, ?, ?, ?)
        `, [orderId, item.productName, item.quantity, item.price]);
      }
      
      await connection.commit();
      
      // Return the complete order with items
      const newOrder = {
        id: orderId,
        customer_name: customerName,
        phone: phone,
        address: address,
        total_amount: totalAmount,
        created_at: new Date(),
        updated_at: new Date(),
        items: items
      };
      
      return newOrder;
    } catch (error) {
      await connection.rollback();
      throw new Error('Error creating order: ' + error.message);
    } finally {
      connection.release();
    }
  }

  // Get order by ID with items
  static async getById(id) {
    try {
      const [orders] = await pool.query('SELECT * FROM orders WHERE id = ?', [id]);
      
      if (orders.length === 0) {
        return null;
      }
      
      const order = orders[0];
      
      // Get items for this order
      const [items] = await pool.query(`
        SELECT product_name, quantity, price 
        FROM order_items 
        WHERE order_id = ?
      `, [id]);
      
      order.items = items;
      return order;
    } catch (error) {
      throw new Error('Error fetching order: ' + error.message);
    }
  }

  // Get orders by date range
  static async getByDateRange(startDate, endDate) {
    try {
      const [orders] = await pool.query(`
        SELECT * FROM orders 
        WHERE created_at BETWEEN ? AND ?
        ORDER BY created_at DESC
      `, [startDate, endDate]);
      
      // Get items for each order
      for (let order of orders) {
        const [items] = await pool.query(`
          SELECT product_name, quantity, price 
          FROM order_items 
          WHERE order_id = ?
        `, [order.id]);
        
        order.items = items;
      }
      
      return orders;
    } catch (error) {
      throw new Error('Error fetching orders by date range: ' + error.message);
    }
  }
}

module.exports = Order;
