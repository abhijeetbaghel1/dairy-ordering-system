// API Configuration for Vercel Serverless
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? ''  // Use relative URLs for Vercel serverless
  : 'http://10.246.55.85:5000';  // Local development

// Export API endpoints for serverless functions
export const API_ENDPOINTS = {
  products: '/api/products',
  orders: '/api/orders',
  setupDb: '/api/setup-db'
};

export default API_BASE_URL;
