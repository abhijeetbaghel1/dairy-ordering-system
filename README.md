# Dairy Ordering System - MERN Stack

A simple dairy ordering website for local dairy owners where customers can order dairy products online and owners can view incoming orders.

## Project Structure

```
dairy-ordering-system/
├── backend/
│   ├── models/
│   │   ├── Product.js
│   │   └── Order.js
│   ├── routes/
│   │   ├── products.js
│   │   └── orders.js
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   │   ├── ProductsPage.js
│   │   │   ├── CheckoutPage.js
│   │   │   └── OwnerOrdersPage.js
│   │   ├── App.js
│   │   └── index.js
│   ├── public/
│   └── package.json
└── README.md
```

## Features

- **Customer Products Page**: View and select dairy products with quantities
- **Checkout Page**: Place orders with customer details
- **Owner Orders Page**: View all incoming orders (admin view)
- **No Authentication**: Simple, open ordering system
- **MongoDB**: Store products and orders

## Tech Stack

- **Frontend**: React
- **Backend**: Node.js + Express
- **Database**: MongoDB with Mongoose
- **No Payments**: Simple ordering system only

## Getting Started

1. Install dependencies in both frontend and backend folders
2. Set up MongoDB connection
3. Start backend server
4. Start React development server
5. Access the application

## Pages

1. `/` - Products page (customer view)
2. `/checkout` - Checkout/order page
3. `/orders` - Owner orders page (admin view)
