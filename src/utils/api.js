// API Base URL
const API_BASE_URL = 'https://warmdelightsbackend.onrender.com';

// Helper function for JSON API calls (NO files!)
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = localStorage.getItem('token');

  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API request failed:', error.message);
    throw error;
  }
};

// Auth API functions
export const loginUser = async (email, password) => {
  return apiRequest('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
};

export const registerUser = async (userData) => {
  return apiRequest('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  });
};

export const getProfile = async () => {
  return apiRequest('/api/auth/profile');
};

export const updateProfile = async (userData) => {
  return apiRequest('/api/auth/profile', {
    method: 'PUT',
    body: JSON.stringify(userData),
  });
};

// Products API functions
export const getProducts = async () => apiRequest('/api/products');
export const getProductById = async (id) => apiRequest(`/api/products/${id}`);
export const createProduct = async (productData) =>
  apiRequest('/api/products', { method: 'POST', body: JSON.stringify(productData) });
export const updateProduct = async (id, productData) =>
  apiRequest(`/api/products/${id}`, { method: 'PUT', body: JSON.stringify(productData) });
export const deleteProduct = async (id) =>
  apiRequest(`/api/products/${id}`, { method: 'DELETE' });

// Orders API functions
export const getOrders = async () => apiRequest('/api/orders');
export const getOrderById = async (id) => apiRequest(`/api/orders/${id}`);
export const createOrder = async (orderData) =>
  apiRequest('/api/orders', { method: 'POST', body: JSON.stringify(orderData) });
export const updateOrderStatus = async (id, status) =>
  apiRequest(`/api/orders/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) });

// Gallery API functions
export const getGalleryImages = async () => apiRequest('/api/gallery');
export const uploadGalleryImage = async (formData) => {
  const token = localStorage.getItem('token');
  const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
  const response = await fetch(`${API_BASE_URL}/api/gallery/upload`, {
    method: 'POST',
    headers,
    body: formData,
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Upload failed');
  }
  return await response.json();
};
export const deleteGalleryImage = async (id) => apiRequest(`/api/gallery/${id}`, { method: 'DELETE' });
export const updateGalleryImage = async (id, imageData) =>
  apiRequest(`/api/gallery/${id}`, { method: 'PUT', body: JSON.stringify(imageData) });

// Analytics API functions
export const getAnalytics = async () => apiRequest('/api/analytics');
export const getRecentActivity = async () => apiRequest('/api/analytics/recent-activity');
export const trackEvent = async (eventData) =>
  apiRequest('/api/analytics/track', { method: 'POST', body: JSON.stringify(eventData) });

// --------- FIXED: FormData handler for custom order (NO Content-Type header!) ---------
export const createCustomOrder = async (formData) => {
  const token = localStorage.getItem('token');
  const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
  const response = await fetch(`${API_BASE_URL}/api/custom-orders`, {
    method: 'POST',
    headers,
    body: formData,
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};

export const getCustomOrders = async () => apiRequest('/api/custom-orders');

// Default export
const api = {
  loginUser,
  registerUser,
  getProfile,
  updateProfile,

  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,

  getOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,

  getGalleryImages,
  uploadGalleryImage,
  deleteGalleryImage,
  updateGalleryImage,

  getAnalytics,
  getRecentActivity,
  trackEvent,

  createCustomOrder,
  getCustomOrders,
};

export default api;
