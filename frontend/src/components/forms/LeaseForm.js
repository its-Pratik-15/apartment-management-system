import React, { useState, useEffect } from 'react';
import { apiService } from '../../services/api';

const LeaseForm = ({ onSubmit, onCancel, initialData = null }) => {
  const [formData, setFormData] = useState({
    flatId: '',
    tenantId: '',
    startDate: '',
    endDate: '',
    monthlyRent: '',
    securityDeposit: ''
  });
  const [flats, setFlats] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchFlats();
    fetchTenants();
    
    if (initialData) {
      setFormData({
        flatId: initialData.flatId || '',
        tenantId: initialData.tenantId || '',
        startDate: initialData.startDate ? new Date(initialData.startDate).toISOString().split('T')[0] : '',
        endDate: initialData.endDate ? new Date(initialData.endDate).toISOString().split('T')[0] : '',
        monthlyRent: initialData.monthlyRent || '',
        securityDeposit: initialData.securityDeposit || ''
      });
    }
  }, [initialData]);

  const fetchFlats = async () => {
    try {
      const response = await apiService.flats.getAll();
      // Filter flats that are owner-occupied (available for lease)
      const availableFlats = response.data.data.flats.filter(
        flat => flat.occupancyStatus === 'OWNER_OCCUPIED'
      );
      setFlats(availableFlats);
    } catch (error) {
      console.error('Error fetching flats:', error);
    }
  };

  const fetchTenants = async () => {
    try {
      const response = await apiService.users.getByRole('TENANT');
      setTenants(response.data.data.users);
    } catch (error) {
      console.error('Error fetching tenants:', error);
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

    if (!formData.tenantId) {
      newErrors.tenantId = 'Please select a tenant';
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }

    if (!formData.endDate) {
      newErrors.endDate = 'End date is required';
    }

    if (formData.startDate && formData.endDate) {
      const startDate = new Date(formData.startDate);
      const endDate = new Date(formData.endDate);
      
      if (endDate <= startDate) {
        newErrors.endDate = 'End date must be after start date';
      }
    }

    if (!formData.monthlyRent || formData.monthlyRent <= 0) {
      newErrors.monthlyRent = 'Monthly rent must be greater than 0';
    }

    if (!formData.securityDeposit || formData.securityDeposit < 0) {
      newErrors.securityDeposit = 'Security deposit must be 0 or greater';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    try {
      const submitData = {
        ...formData,
        monthlyRent: parseFloat(formData.monthlyRent),
        securityDeposit: parseFloat(formData.securityDeposit)
      };
      
      await onSubmit(submitData);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setLoading(false);
    }
  };

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
                Flat {flat.flatNumber} - Floor {flat.floor} ({flat.bedrooms}BHK)
              </option>
            ))}
          </select>
          {errors.flatId && (
            <p className="mt-1 text-sm text-red-600">{errors.flatId}</p>
          )}
        </div>

        {/* Tenant Selection */}
        <div>
          <label htmlFor="tenantId" className="block text-sm font-medium text-gray-700">
            Tenant <span className="text-red-500">*</span>
          </label>
          <select
            id="tenantId"
            name="tenantId"
            value={formData.tenantId}
            onChange={handleInputChange}
            className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
              errors.tenantId ? 'border-red-300' : 'border-gray-300'
            }`}
          >
            <option value="">Select a tenant</option>
            {tenants.map((tenant) => (
              <option key={tenant.id} value={tenant.id}>
                {tenant.firstName} {tenant.lastName} ({tenant.email})
              </option>
            ))}
          </select>
          {errors.tenantId && (
            <p className="mt-1 text-sm text-red-600">{errors.tenantId}</p>
          )}
        </div>

        {/* Start Date */}
        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
            Start Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            value={formData.startDate}
            onChange={handleInputChange}
            className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
              errors.startDate ? 'border-red-300' : 'border-gray-300'
            }`}
          />
          {errors.startDate && (
            <p className="mt-1 text-sm text-red-600">{errors.startDate}</p>
          )}
        </div>

        {/* End Date */}
        <div>
          <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
            End Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            id="endDate"
            name="endDate"
            value={formData.endDate}
            onChange={handleInputChange}
            className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
              errors.endDate ? 'border-red-300' : 'border-gray-300'
            }`}
          />
          {errors.endDate && (
            <p className="mt-1 text-sm text-red-600">{errors.endDate}</p>
          )}
        </div>

        {/* Monthly Rent */}
        <div>
          <label htmlFor="monthlyRent" className="block text-sm font-medium text-gray-700">
            Monthly Rent (₹) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            id="monthlyRent"
            name="monthlyRent"
            value={formData.monthlyRent}
            onChange={handleInputChange}
            min="0"
            step="0.01"
            className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
              errors.monthlyRent ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="Enter monthly rent amount"
          />
          {errors.monthlyRent && (
            <p className="mt-1 text-sm text-red-600">{errors.monthlyRent}</p>
          )}
        </div>

        {/* Security Deposit */}
        <div>
          <label htmlFor="securityDeposit" className="block text-sm font-medium text-gray-700">
            Security Deposit (₹) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            id="securityDeposit"
            name="securityDeposit"
            value={formData.securityDeposit}
            onChange={handleInputChange}
            min="0"
            step="0.01"
            className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
              errors.securityDeposit ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="Enter security deposit amount"
          />
          {errors.securityDeposit && (
            <p className="mt-1 text-sm text-red-600">{errors.securityDeposit}</p>
          )}
        </div>
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
          {loading ? 'Creating...' : (initialData ? 'Update Lease' : 'Create Lease')}
        </button>
      </div>
    </form>
  );
};

export default LeaseForm;