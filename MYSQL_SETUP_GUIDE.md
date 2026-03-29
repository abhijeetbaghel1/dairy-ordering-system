# 🐬 MySQL Setup Guide - Dairy Ordering System

## 📋 What You'll Get
- **Traditional MySQL database** with visible tables
- **Easy data viewing** in any MySQL client
- **Relational database structure** with proper foreign keys
- **Real-time data persistence** across server restarts

## 🗄️ Database Structure

### Tables Created:
1. **products** - Dairy products catalog
   ```sql
   CREATE TABLE products (
     id INT AUTO_INCREMENT PRIMARY KEY,
     name VARCHAR(255) NOT NULL,
     price DECIMAL(10, 2) NOT NULL,
     unit VARCHAR(50) NOT NULL,
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
   );
   ```

2. **orders** - Customer orders
   ```sql
   CREATE TABLE orders (
     id INT AUTO_INCREMENT PRIMARY KEY,
     customer_name VARCHAR(255) NOT NULL,
     phone VARCHAR(20) NOT NULL,
     address TEXT NOT NULL,
     total_amount DECIMAL(10, 2) NOT NULL,
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
   );
   ```

3. **order_items** - Individual items in each order
   ```sql
   CREATE TABLE order_items (
     id INT AUTO_INCREMENT PRIMARY KEY,
     order_id INT NOT NULL,
     product_name VARCHAR(255) NOT NULL,
     quantity INT NOT NULL,
     price DECIMAL(10, 2) NOT NULL,
     FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
   );
   ```

## 🚀 Setup Instructions

### 1. Install MySQL Server
**Windows:**
- Download MySQL Community Server from https://dev.mysql.com/downloads/mysql/
- Install with default settings
- Set root password during installation

**Alternative: XAMPP/WAMP**
- Install XAMPP (includes MySQL)
- Start MySQL from XAMPP control panel
- Default: username=root, password= (empty)

### 2. Create Database
```sql
-- Open MySQL Command Line or any MySQL client
CREATE DATABASE dairy_ordering;
USE dairy_ordering;
```

### 3. Configure Connection
Edit `.env.mysql` file:
```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password  # Leave empty if no password
DB_NAME=dairy_ordering
```

### 4. Install Dependencies & Seed Database
```bash
cd backend
npm install
node seed-mysql.js
```

### 5. Start MySQL Server
```bash
node server-mysql.js
```

## 🔍 How to View Your Data

### Option 1: MySQL Command Line
```bash
mysql -u root -p
USE dairy_ordering;

-- View all products
SELECT * FROM products;

-- View all orders with items
SELECT o.*, oi.product_name, oi.quantity, oi.price 
FROM orders o 
LEFT JOIN order_items oi ON o.id = oi.order_id 
ORDER BY o.created_at DESC;
```

### Option 2: GUI Tools (Recommended)
- **phpMyAdmin** (comes with XAMPP)
- **MySQL Workbench** (official MySQL tool)
- **DBeaver** (free universal database tool)
- **HeidiSQL** (Windows MySQL client)

### Option 3: VS Code Extensions
- **MySQL** extension by Jun Han
- **SQLTools** extension

## 📊 Sample Data Views

### Products Table:
| id | name   | price | unit    | created_at          |
|----|--------|-------|---------|---------------------|
| 1  | Milk   | 50.00 | Liter   | 2024-03-29 10:30:00 |
| 2  | Curd   | 40.00 | 500g    | 2024-03-29 10:30:00 |
| 3  | Paneer | 120.00| 500g    | 2024-03-29 10:30:00 |

### Orders Table:
| id | customer_name | phone       | address         | total_amount | created_at          |
|----|---------------|-------------|-----------------|--------------|---------------------|
| 1  | John Doe      | 1234567890  | 123 Main St    | 260.00       | 2024-03-29 11:15:00 |

### Order_Items Table:
| id | order_id | product_name | quantity | price  |
|----|----------|---------------|----------|--------|
| 1  | 1        | Milk          | 2        | 50.00  |
| 2  | 1        | Paneer        | 1        | 120.00 |
| 3  | 1        | Curd          | 1        | 40.00  |

## 🔄 Migration from MongoDB

### Key Differences:
- **No Mongoose** - Using raw MySQL queries
- **Explicit Schema** - Tables must be created first
- **Relational** - Separate table for order items
- **Manual Timestamps** - Using MySQL TIMESTAMP columns

### Benefits:
- ✅ **Visible Data** - Easy to see all records
- ✅ **SQL Queries** - Powerful data analysis
- ✅ **GUI Tools** - Many free MySQL clients
- ✅ **Backup/Export** - Easy data export
- ✅ **Scalability** - Proven for production

## 🧪 Testing MySQL Integration

### API Endpoints:
- `GET /api/products` - Get all products
- `POST /api/orders` - Create new order
- `GET /api/orders` - Get all orders with items
- `GET /api/orders/:id` - Get specific order
- `GET /api/orders/date-range/:start/:end` - Get orders by date range

### Test with curl:
```bash
# Test products
curl http://localhost:5000/api/products

# Test orders
curl http://localhost:5000/api/orders

# Create test order
curl -X POST http://localhost:5000/api/orders \
-H "Content-Type: application/json" \
-d '{
  "customerName": "Test Customer",
  "phone": "1234567890",
  "address": "123 Test Street",
  "items": [
    {"productName": "Milk", "quantity": 2, "price": 50}
  ],
  "totalAmount": 100
}'
```

## 🎯 Quick Start Commands

```bash
# 1. Install dependencies
cd backend
npm install

# 2. Seed database (creates tables + sample data)
node seed-mysql.js

# 3. Start server
node server-mysql.js

# 4. Test frontend (in another terminal)
cd ../frontend
npm start
```

## 🎉 You're Ready!

Your dairy ordering system now uses MySQL with:
- **Visible database tables**
- **Easy data viewing**
- **Relational structure**
- **Production-ready architecture**

Access your database anytime using any MySQL client to view orders, products, and customer data!
