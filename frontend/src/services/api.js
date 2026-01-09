import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5001/api',
  timeout: 60000, // 60 seconds for resume reliability
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

// Response interceptor to handle errors with retry logic
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Handle 401 errors (unauthorized)
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
      return Promise.reject(error);
    }
    
    // Handle timeout errors with retry for resume reliability
    if (error.code === 'ECONNABORTED' && !originalRequest._retry) {
      console.log('Request timeout - Retrying once for resume reliability...');
      originalRequest._retry = true;
      originalRequest.timeout = 90000; // Increase timeout for retry
      
      try {
        return await api(originalRequest);
      } catch (retryError) {
        console.error('Retry failed - Backend may be sleeping');
        retryError.message = 'Connection timeout. The server may be starting up, please try again in a moment.';
        return Promise.reject(retryError);
      }
    }
    
    // Handle network errors
    if (!error.response) {
      console.error('Network error:', error.message);
      error.message = 'Unable to connect to server. Please check your connection or try again later.';
    }
    
    return Promise.reject(error);
  }
);

// API service object
export const apiService = {
  // Set auth token
  setAuthToken: (token) => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.common['Authorization'];
    }
  },

  // Generic methods
  get: (url, config) => api.get(url, config),
  post: (url, data, config) => api.post(url, data, config),
  put: (url, data, config) => api.put(url, data, config),
  patch: (url, data, config) => api.patch(url, data, config),
  delete: (url, config) => api.delete(url, config),

  // Auth endpoints
  auth: {
    login: (email, password) => api.post('/auth/login', { email, password }),
    register: (userData) => api.post('/auth/register', userData),
    getProfile: () => api.get('/auth/profile'),
    updateProfile: (userData) => api.put('/auth/profile', userData),
    changePassword: (passwordData) => api.put('/auth/change-password', passwordData),
    logout: () => api.post('/auth/logout'),
  },

  // User endpoints
  users: {
    getAll: (params) => api.get('/users', { params }),
    getById: (id) => api.get(`/users/${id}`),
    create: (userData) => api.post('/users', userData),
    update: (id, userData) => api.put(`/users/${id}`, userData),
    delete: (id) => api.delete(`/users/${id}`),
    getByRole: (role) => api.get(`/users/role/${role}`),
  },

  // Flat endpoints
  flats: {
    getAll: (params) => api.get('/flats', { params }),
    getById: (id) => api.get(`/flats/${id}`),
    create: (flatData) => api.post('/flats', flatData),
    update: (id, flatData) => api.put(`/flats/${id}`, flatData),
    delete: (id) => api.delete(`/flats/${id}`),
  },

  // Lease endpoints
  leases: {
    getAll: (params) => api.get('/leases', { params }),
    getById: (id) => api.get(`/leases/${id}`),
    create: (leaseData) => api.post('/leases', leaseData),
    update: (id, leaseData) => api.put(`/leases/${id}`, leaseData),
    terminate: (id, terminationData) => api.patch(`/leases/${id}/terminate`, terminationData),
  },

  // Bill endpoints
  bills: {
    getAll: (params) => api.get('/bills', { params }),
    getById: (id) => api.get(`/bills/${id}`),
    create: (billData) => api.post('/bills', billData),
    update: (id, billData) => api.put(`/bills/${id}`, billData),
    pay: (id, paymentData) => api.patch(`/bills/${id}/pay`, paymentData),
    getSummary: () => api.get('/bills/summary'),
    getOverdue: () => api.get('/bills/overdue'),
  },

  // Alert endpoints
  alerts: {
    getAll: (params) => api.get('/alerts', { params }),
  },

  // Visitor endpoints
  visitors: {
    getAll: (params) => api.get('/visitors', { params }),
    getById: (id) => api.get(`/visitors/${id}`),
    create: (visitorData) => api.post('/visitors', visitorData),
    updateStatus: (id, statusData) => api.patch(`/visitors/${id}/status`, statusData),
    recordCheckIn: (id) => api.patch(`/visitors/${id}/checkin`),
    recordExit: (id) => api.patch(`/visitors/${id}/exit`),
    getPending: () => api.get('/visitors/pending'),
  },

  // Notice endpoints
  notices: {
    getAll: (params) => api.get('/notices', { params }),
    getById: (id) => api.get(`/notices/${id}`),
    create: (noticeData) => api.post('/notices', noticeData),
    update: (id, noticeData) => api.put(`/notices/${id}`, noticeData),
    delete: (id) => api.delete(`/notices/${id}`),
    togglePin: (id) => api.patch(`/notices/${id}/pin`),
    getPinned: () => api.get('/notices/pinned'),
  },

  // Issue endpoints
  issues: {
    getAll: (params) => api.get('/issues', { params }),
    getById: (id) => api.get(`/issues/${id}`),
    create: (issueData) => api.post('/issues', issueData),
    update: (id, issueData) => api.put(`/issues/${id}`, issueData),
    delete: (id) => api.delete(`/issues/${id}`),
    assign: (id, assignData) => api.patch(`/issues/${id}/assign`, assignData),
    getStats: () => api.get('/issues/stats'),
  },
};

export default api;