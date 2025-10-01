import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Banner API
export const bannerAPI = {
  getAll: () => api.get('/banners'),
  getActive: () => api.get('/banners?active=true'),
  getById: (id) => api.get(`/banners/${id}`),
};

// Brand API
export const brandAPI = {
  getAll: () => api.get('/brands'),
  getActive: () => api.get('/brands?active=true'),
  getById: (id) => api.get(`/brands/${id}`),
  getByName: (name) => api.get(`/brands/name/${name}`),
};

// Car API
export const carAPI = {
  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return api.get(`/cars${queryString ? `?${queryString}` : ''}`);
  },
  getById: (id) => api.get(`/cars/${id}`),
  getFeatured: (limit = 6) => api.get(`/cars/featured/list?limit=${limit}`),
  getRental: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return api.get(`/cars/rental/list${queryString ? `?${queryString}` : ''}`);
  },
  getStats: () => api.get('/cars/stats/overview'),
};

// Rental API
export const rentalAPI = {
  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return api.get(`/rentals${queryString ? `?${queryString}` : ''}`);
  },
  getById: (id) => api.get(`/rentals/${id}`),
  createRequest: (data) => api.post('/rentals/request', data),
  checkAvailability: (data) => api.post('/rentals/check-availability', data),
  getStats: () => api.get('/rentals/stats/overview'),
};

// Utility functions
export const handleApiError = (error) => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  if (error.message) {
    return error.message;
  }
  return 'An unexpected error occurred';
};

export const formatPrice = (price) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
};

export const formatDate = (date) => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date));
};

export default api;