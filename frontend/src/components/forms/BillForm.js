import React, { useState, useEffect } from 'react';
import { apiService } from '../../services/api';
import { showSuccess, showError, showLoading, dismissToast } from '../ErrorMessage';

const BillForm = ({ onSubmit, onCancel, initialData = null }) => {
  const [formData, setFormData] = useState({
    flatId: '',
    billType: '',
    amount: '',
    dueDate: '',
    description: ''
  });
  const [flats, setFlats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchFlats();
    
    if (initialData) {
      setFormData({
        flatId: initialData.flatId || '',
        billType: initialData.billType || '',
        amount: initialData.amount || '',
        dueDate: initialData.dueDate ? new Date(initialData.dueDate).toISOString().split('T')[0] : '',
        description: initialData.description || ''
      });
    }
  }, [initialData]);

  const fetchFlats = async () => {
    try {
      const response = await apiService.flats.getAll();
      setFlats(response.data.data.flats);
    } catch (error) {
      console.error('Error fetching flats:', error);
      showError('Failed to load flats. Please refresh the page.');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.flatId) {
      newErrors.flatId = 'Please select a flat';
    }

    if (!formData.billType) {
      newErrors.billType = 'Please select a bill type';
    }

    if (!formData.amount || formData.amount <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }

    if (!formData.dueDate) {
      newErrors.dueDate = 'Due date is required';
    }

    // Check if due date is in the past
    if (formData.dueDate) {
      const dueDate = new Date(formData.dueDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (dueDate < today) {
        newErrors.dueDate = 'Due date cannot be in the past';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      showError('Please fix the form errors before submitting.');
      return;
    }

    setLoading(true);
    const loadingToast = showLoading('Saving bill...');
    
    try {
      const submitData = {
        ...formData,
        amount: parseFloat(formData.amount)
      };
      
      await onSubmit(submitData);
      dismissToast(loadingToast);
      showSuccess('Bill saved successfully!');
    } catch (error) {
      console.error('Error submitting form:', error);
      dismissToast(loadingToast);
      showError('Failed to save bill. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const billTypes = [
    { value: 'RENT', label: 'Rent' },
    { value: 'ELECTRICITY', label: 'Electricity' },
    { value: 'WATER', label: 'Water' },
    { value: 'MAINTENANCE', label: 'Maintenance' },
    { value: 'PARKING', label: 'Parking' },
    { value: 'PENALTY', label: 'Penalty' }
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {/* Flat Selection */}
        <div>
          <label htmlFor="flatId" className="block text-sm font-medium text-gray-700">
            Flat <span className="text-red-500">*</span>
          </label>
          <select
            id="flatId"
            name="flatId"
            value={formData.flatId}
            onChange={handleInputChange}
            className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
              errors.flatId ? 'border-red-300' : 'border-gray-300'
            }`}
          >
            <option value="">Select a flat</option>
            {flats.map((flat) => (
              <option key={flat.id} value={flat.id}>
                Flat {flat.flatNumber} - Floor {flat.floor} ({flat.owner?.firstName} {flat.owner?.lastName})
              </option>
            ))}
          </select>
          {errors.flatId && (
            <p className="mt-1 text-sm text-red-600">{errors.flatId}</p>
          )}
        </div>

        {/* Bill Type */}
        <div>
          <label htmlFor="billType" className="block text-sm font-medium text-gray-700">
            Bill Type <span className="text-red-500">*</span>
          </label>
          <select
            id="billType"
            name="billType"
            value={formData.billType}
            onChange={handleInputChange}
            className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
              errors.billType ? 'border-red-300' : 'border-gray-300'
            }`}
          >
            <option value="">Select bill type</option>
            {billTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
          {errors.billType && (
            <p className="mt-1 text-sm text-red-600">{errors.billType}</p>
          )}
        </div>

        {/* Amount */}
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
            Amount (₹) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            id="amount"
            name="amount"
            value={formData.amount}
            onChange={handleInputChange}
            min="0"
            step="0.01"
            className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
              errors.amount ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="Enter bill amount"
          />
          {errors.amount && (
            <p className="mt-1 text-sm text-red-600">{errors.amount}</p>
          )}
        </div>

        {/* Due Date */}
        <div>
          <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">
            Due Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            id="dueDate"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleInputChange}
            className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
              errors.dueDate ? 'border-red-300' : 'border-gray-300'
            }`}
          />
          {errors.dueDate && (
            <p className="mt-1 text-sm text-red-600">{errors.dueDate}</p>
          )}
        </div>
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          rows={3}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          placeholder="Enter bill description (optional)"
        />
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Creating...' : (initialData ? 'Update Bill' : 'Create Bill')}
        </button>
      </div>
    </form>
  );
};

export default BillForm;