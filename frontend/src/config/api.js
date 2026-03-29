// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 
  (process.env.NODE_ENV === 'production' 
    ? 'https://dairy-backend.onrender.com'  // Render backend (recommended)
    : 'https://your-backend-url.railway.app')  // Railway backend
    : 'http://10.246.55.85:5000');           // Local development

export default API_BASE_URL;
