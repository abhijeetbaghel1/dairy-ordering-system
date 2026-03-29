import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_BASE_URL, { API_ENDPOINTS } from '../config/api';

function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}${API_ENDPOINTS.products}`);
      setProducts(response.data);
      
      // Initialize quantities with 0 for each product
      const initialQuantities = {};
      response.data.forEach(product => {
        initialQuantities[product.id] = 0;
      });
      setQuantities(initialQuantities);
      setLoading(false);
    } catch (error) {
      setError('Failed to fetch products');
      setLoading(false);
    }
  };

  const handleQuantityChange = (productId, value) => {
    const newValue = Math.max(0, parseInt(value) || 0);
    setQuantities(prev => ({
      ...prev,
      [productId]: newValue
    }));
  };

  const getTotalItems = () => {
    return Object.values(quantities).reduce((sum, qty) => sum + qty, 0);
  };

  const handleOrderNow = () => {
    const selectedProducts = products.filter(product => quantities[product.id] > 0);
    
    if (selectedProducts.length === 0) {
      alert('Please select at least one product');
      return;
    }

    const orderData = selectedProducts.map(product => ({
      productId: product.id,
      name: product.name,
      price: product.price,
      unit: product.unit,
      quantity: quantities[product.id],
      subtotal: product.price * quantities[product.id]
    }));

    // Store order data in localStorage for checkout page
    localStorage.setItem('selectedProducts', JSON.stringify(orderData));
    navigate('/checkout');
  };

  if (loading) {
    return <div className="container"><h2>Loading products...</h2></div>;
  }

  if (error) {
    return <div className="container">
      <div className="error-message">{error}</div>
    </div>;
  }

  return (
    <div className="container">
      <h2>🥛 Fresh Dairy Products</h2>
      <p>Select quantities for the products you want to order:</p>
      
      <div className="products-grid">
        {products.map(product => (
          <div key={product.id} className="product-card">
            <h3>{product.name}</h3>
            <p className="price">₹{product.price} / {product.unit}</p>
            <div className="quantity-selector">
              <label>Quantity:</label>
              <input
                type="number"
                min="0"
                value={quantities[product.id]}
                onChange={(e) => handleQuantityChange(product.id, e.target.value)}
              />
            </div>
            {quantities[product.id] > 0 && (
              <div className="subtotal">
                Subtotal: ₹{product.price * quantities[product.id]}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="order-summary">
        <h3>Order Summary</h3>
        <p>Total Items: {getTotalItems()}</p>
        <button 
          className="btn" 
          onClick={handleOrderNow}
          disabled={getTotalItems() === 0}
        >
          Order Now ({getTotalItems()} items)
        </button>
      </div>
    </div>
  );
}

export default ProductsPage;
