import React from 'react';
import toast from 'react-hot-toast';

// Centralized error message component
const ErrorMessage = ({ 
  type = 'error', 
  message, 
  duration = 4000,
  position = 'top-right',
  showToast = true 
}) => {
  // Show toast notification if enabled
  if (showToast && message) {
    switch (type) {
      case 'success':
        toast.success(message, { duration, position });
        break;
      case 'error':
        toast.error(message, { duration, position });
        break;
      case 'warning':
        toast(message, { 
          duration, 
          position,
          icon: '⚠️',
          style: {
            background: '#FEF3C7',
            color: '#92400E',
            border: '1px solid #F59E0B'
          }
        });
        break;
      case 'info':
        toast(message, { 
          duration, 
          position,
          icon: 'ℹ️',
          style: {
            background: '#DBEAFE',
            color: '#1E40AF',
            border: '1px solid #3B82F6'
          }
        });
        break;
      default:
        toast.error(message, { duration, position });
    }
  }

  // Return null since we're using toast notifications
  return null;
};

// Utility functions for easy toast usage
export const showSuccess = (message, options = {}) => {
  toast.success(message, {
    duration: 4000,
    position: 'top-right',
    ...options
  });
};

export const showError = (message, options = {}) => {
  toast.error(message, {
    duration: 5000,
    position: 'top-right',
    ...options
  });
};

export const showWarning = (message, options = {}) => {
  toast(message, {
    duration: 4000,
    position: 'top-right',
    icon: '⚠️',
    style: {
      background: '#FEF3C7',
      color: '#92400E',
      border: '1px solid #F59E0B'
    },
    ...options
  });
};

export const showInfo = (message, options = {}) => {
  toast(message, {
    duration: 4000,
    position: 'top-right',
    icon: 'ℹ️',
    style: {
      background: '#DBEAFE',
      color: '#1E40AF',
      border: '1px solid #3B82F6'
    },
    ...options
  });
};

export const showLoading = (message, options = {}) => {
  return toast.loading(message, {
    position: 'top-right',
    ...options
  });
};

export const dismissToast = (toastId) => {
  toast.dismiss(toastId);
};

export const dismissAllToasts = () => {
  toast.dismiss();
};

export default ErrorMessage;