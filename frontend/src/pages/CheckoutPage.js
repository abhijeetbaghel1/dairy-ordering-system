import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_BASE_URL, { API_ENDPOINTS } from '../config/api';

function CheckoutPage() {
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [customerInfo, setCustomerInfo] = useState({
    customerName: '',
    phone: '',
    address: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const storedProducts = localStorage.getItem('selectedProducts');
    if (storedProducts) {
      setSelectedProducts(JSON.parse(storedProducts));
    } else {
      // No products selected, redirect to products page
      navigate('/');
    }
  }, [navigate]);

  const calculateTotal = () => {
    return selectedProducts.reduce((sum, product) => sum + (product.price * product.quantity), 0);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!customerInfo.customerName.trim()) {
      setError('Please enter your name');
      return false;
    }
    if (!customerInfo.phone.trim()) {
      setError('Please enter your phone number');
      return false;
    }
    if (!customerInfo.address.trim()) {
      setError('Please enter your delivery address');
      return false;
    }
    return true;
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const orderData = {
        customerName: customerInfo.customerName,
        phone: customerInfo.phone,
        address: customerInfo.address,
        items: selectedProducts.map(product => ({
          productName: product.name,
          quantity: product.quantity,
          price: product.price
        })),
        totalAmount: calculateTotal()
      };

      const response = await axios.post(`${API_BASE_URL}${API_ENDPOINTS.orders}`, orderData);
      
      if (response.data) {
        setSuccess(true);
        // Clear localStorage
        localStorage.removeItem('selectedProducts');
        // Reset form
        setCustomerInfo({ customerName: '', phone: '', address: '' });
      }
    } catch (error) {
      setError('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleContinueShopping = () => {
    navigate('/');
  };

  if (success) {
    return (
      <div className="container">
        <div className="success-message">
          <h2>🎉 Order Placed Successfully!</h2>
          <p>Your order has been received and will be delivered soon.</p>
          <p>Order details have been sent to the dairy owner.</p>
          <button className="btn" onClick={handleContinueShopping}>
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <h2>Checkout</h2>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="checkout-content">
        <div className="order-summary">
          <h3>Order Summary</h3>
          {selectedProducts.map((product, index) => (
            <div key={index} className="order-item">
              <span>{product.name} x {product.quantity} {product.unit}</span>
              <span>₹{product.price * product.quantity}</span>
            </div>
          ))}
          <div className="order-total">
            <strong>Total Amount: ₹{calculateTotal()}</strong>
          </div>
        </div>

        <form onSubmit={handlePlaceOrder} className="customer-form">
          <h3>Customer Information</h3>
          
          <div className="form-group">
            <label htmlFor="customerName">Full Name *</label>
            <input
              type="text"
              id="customerName"
              name="customerName"
              value={customerInfo.customerName}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">Mobile Number *</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={customerInfo.phone}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="address">Delivery Address *</label>
            <textarea
              id="address"
              name="address"
              value={customerInfo.address}
              onChange={handleInputChange}
              rows="3"
              required
            ></textarea>
          </div>

          <button 
            type="submit" 
            className="btn" 
            disabled={loading}
          >
            {loading ? 'Placing Order...' : 'Place Order'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CheckoutPage;
