import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL, { API_ENDPOINTS } from '../config/api';

function OwnerOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}${API_ENDPOINTS.orders}`);
      setOrders(response.data);
      setLoading(false);
    } catch (error) {
      setError('Failed to fetch orders');
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  if (loading) {
    return <div className="container"><h2>Loading orders...</h2></div>;
  }

  if (error) {
    return <div className="container">
      <div className="error-message">{error}</div>
    </div>;
  }

  return (
    <div className="container">
      <h2>📋 All Orders</h2>
      <p>View all customer orders here</p>
      
      {orders.length === 0 ? (
        <div className="no-orders">
          <h3>No orders yet</h3>
          <p>When customers place orders, they will appear here.</p>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order, index) => (
            <div key={order._id} className="order-card">
              <div className="order-header">
                <div className="order-info">
                  <h3>Order #{index + 1}</h3>
                  <p className="order-date">{formatDate(order.createdAt)}</p>
                </div>
                <div className="order-total">
                  <strong>Total: ₹{order.totalAmount}</strong>
                </div>
              </div>
              
              <div className="customer-details">
                <h4>Customer Information</h4>
                <p><strong>Name:</strong> {order.customerName}</p>
                <p><strong>Phone:</strong> {order.phone}</p>
                <p><strong>Address:</strong> {order.address}</p>
              </div>
              
              <div className="order-items">
                <h4>Order Items</h4>
                {order.items.map((item, itemIndex) => (
                  <div key={itemIndex} className="order-item">
                    <span>{item.productName} x {item.quantity}</span>
                    <span>₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default OwnerOrdersPage;
