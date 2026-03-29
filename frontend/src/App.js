import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import ProductsPage from './pages/ProductsPage';
import CheckoutPage from './pages/CheckoutPage';
import OwnerOrdersPage from './pages/OwnerOrdersPage';
import './App.css';

function App() {
  return (
    <div className="App">
      <nav className="navbar">
        <div className="nav-container">
          <h1 className="nav-title">🥛 Fresh Dairy</h1>
          <div className="nav-links">
            <Link to="/">Products</Link>
            <Link to="/checkout">Checkout</Link>
            <Link to="/orders">Owner Orders</Link>
          </div>
        </div>
      </nav>

      <main className="main-content">
        <Routes>
          <Route path="/" element={<ProductsPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/orders" element={<OwnerOrdersPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
