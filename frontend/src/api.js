import axios from 'axios';

/**
 * api.js
 * Centralized Axios instance configuration.
 * Handles base URL, timeouts, and interceptors for error handling.
 */

const api = axios.create({
  // The base URL is handled by the Vite proxy in development
  // In production, this would be the actual API domain
  baseURL: '/',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
});

// Response interceptor for global error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Standardized error message extraction
    const message = error.response?.data?.detail || error.message || 'An unexpected error occurred';
    
    // Log error to console for debugging
    console.error('[API Error]:', message);
    
    return Promise.reject({
      message,
      status: error.response?.status,
      data: error.response?.data,
    });
  }
);

export default api;
