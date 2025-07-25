// API Configuration
const getBaseUrl = () => {
  // In browser environment with Vite
  if (typeof window !== 'undefined' && import.meta?.env?.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  // Default fallback
  return 'http://localhost:3000';
};

export const API_CONFIG = {
  // Base URL for API requests
  BASE_URL: getBaseUrl(),

  // API endpoints
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/api/auth/login',
      REGISTER: '/api/auth/register',
    },
    PRODUCTS: '/api/products',
    ORDERS: '/api/orders',
    USERS: '/api/users',
    BANNERS: '/api/banners',
    HEALTH: '/api/health',
  }
};

// Helper function to build full API URL
export function buildApiUrl(endpoint) {
  // If endpoint is already a full URL, return as is
  if (endpoint.startsWith('http')) {
    return endpoint;
  }
  // Build full URL with base URL
  return `${API_CONFIG.BASE_URL}${endpoint}`;
}

// Helper function to get API base URL
export function getApiBaseUrl() {
  return API_CONFIG.BASE_URL;
}
