import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiService } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  // Set token in API service and localStorage
  const saveToken = (newToken) => {
    setToken(newToken);
    if (newToken) {
      localStorage.setItem('token', newToken);
      apiService.setAuthToken(newToken);
    } else {
      localStorage.removeItem('token');
      apiService.setAuthToken(null);
    }
  };

  // Login function
  const login = async (email, password) => {
    try {
      const response = await apiService.post('/auth/login', { email, password });
      const { user: userData, token: userToken } = response.data.data; // Fix: access nested data
      
      setUser(userData);
      saveToken(userToken);
      
      return { success: true, user: userData };
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed' 
      };
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    saveToken(null);
  };

  // Get user profile
  const getProfile = async () => {
    try {
      const response = await apiService.get('/auth/profile');
      setUser(response.data.data.user); // Fix: access nested data
      return response.data.data.user;
    } catch (error) {
      console.error('Get profile error:', error);
      logout(); // Clear invalid token
      throw error;
    }
  };

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        apiService.setAuthToken(token);
        try {
          await getProfile();
        } catch (error) {
          console.error('Failed to get profile:', error);
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, [token]); // eslint-disable-line react-hooks/exhaustive-deps

  // Update user profile
  const updateUser = (updatedUserData) => {
    setUser(updatedUserData);
  };

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    getProfile,
    updateUser,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};