import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';

const FlatEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [flat, setFlat] = useState(null);
  const [owners, setOwners] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [formData, setFormData] = useState({
    flatNumber: '',
    floor: '',
    bedrooms: '',
    bathrooms: '',
    area: '',
    ownerId: '',
    tenantId: '',
    createLease: false,
    monthlyRent: '',
    startDate: '',
    endDate: '',
    securityDeposit: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [flatResponse, ownersResponse, tenantsResponse] = await Promise.all([
        apiService.flats.getById(id),
        apiService.users.getAll({ role: 'OWNER', limit: 100 }),
        apiService.users.getAll({ role: 'TENANT', limit: 100 })
      ]);
      
      const flatData = flatResponse.data.data.flat;
      setFlat(flatData);
      setOwners(ownersResponse.data.data.users);
      setTenants(tenantsResponse.data.data.users);
      
      // Get current active lease if exists
      let currentTenant = '';
      if (flatData.leases && flatData.leases.length > 0) {
        const activeLease = flatData.leases.find(lease => lease.isActive);
        if (activeLease) {
          currentTenant = activeLease.tenantId;
        }
      }
      
      setFormData({
        flatNumber: flatData.flatNumber,
        floor: flatData.floor.toString(),
        bedrooms: flatData.bedrooms.toString(),
        bathrooms: flatData.bathrooms.toString(),
        area: flatData.area.toString(),
        ownerId: flatData.ownerId,
        tenantId: currentTenant,
        createLease: false,
        monthlyRent: '',
        startDate: '',
        endDate: '',
        securityDeposit: ''
      });
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to load flat details');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const updateData = {
        flatNumber: formData.flatNumber,
        floor: parseInt(formData.floor),
        bedrooms: parseInt(formData.bedrooms),
        bathrooms: parseInt(formData.bathrooms),
        area: parseFloat(formData.area),
        ownerId: formData.ownerId
      };

      await apiService.flats.update(id, updateData);

      // Create lease if tenant is assigned and createLease is checked
      if (formData.tenantId && formData.createLease) {
        const leaseData = {
          flatId: id,
          tenantId: formData.tenantId,
          startDate: formData.startDate,
          endDate: formData.endDate,
          monthlyRent: parseFloat(formData.monthlyRent),
          securityDeposit: formData.securityDeposit ? parseFloat(formData.securityDeposit) : null
        };

        await apiService.leases.create(leaseData);
        setMessage({ type: 'success', text: 'Flat updated and lease created successfully!' });
      } else {
        setMessage({ type: 'success', text: 'Flat updated successfully!' });
      }
      
      // Redirect after a short delay
      setTimeout(() => {
        navigate(`/dashboard/flats/${id}`);
      }, 1500);
    } catch (error) {
      console.error('Error updating flat:', error);
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Failed to update flat' 
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !flat) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">{error || 'Flat not found'}</div>
        <Link
          to="/dashboard/flats"
          className="text-blue-600 hover:text-blue-500 font-medium"
        >
          ← Back to Flats
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <nav className="flex" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-4">
            <li>
              <Link to="/dashboard/flats" className="text-gray-400 hover:text-gray-500">
                Flats
              </Link>
            </li>
            <li>
              <div className="flex items-center">
                <svg className="flex-shrink-0 h-5 w-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
                <Link to={`/dashboard/flats/${flat.id}`} className="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700">
                  Flat {flat.flatNumber}
                </Link>
              </div>
            </li>
            <li>
              <div className="flex items-center">
                <svg className="flex-shrink-0 h-5 w-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
                <span className="ml-4 text-sm font-medium text-gray-500">Edit</span>
              </div>
            </li>
          </ol>
        </nav>
        
        <div className="mt-4">
          <h1 className="text-2xl font-bold text-gray-900">Edit Flat {flat.flatNumber}</h1>
          <p className="mt-1 text-sm text-gray-600">Update flat information and details</p>
        </div>
      </div>

      {message.text && (
        <div className={`mb-6 p-4 rounded-md ${
          message.type === 'success' 
            ? 'bg-green-50 text-green-800 border border-green-200' 
            : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {message.text}
        </div>
      )}

      {/* Form */}
      <div className="bg-white shadow rounded-lg">
        <form onSubmit={handleSubmit} className="px-4 py-5 sm:p-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="flatNumber" className="block text-sm font-medium text-gray-700">
                Flat Number *
              </label>
              <input
                type="text"
                name="flatNumber"
                id="flatNumber"
                value={formData.flatNumber}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="floor" className="block text-sm font-medium text-gray-700">
                Floor *
              </label>
              <input
                type="number"
                name="floor"
                id="floor"
                value={formData.floor}
                onChange={handleInputChange}
                required
                min="0"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="bedrooms" className="block text-sm font-medium text-gray-700">
                Bedrooms *
              </label>
              <input
                type="number"
                name="bedrooms"
                id="bedrooms"
                value={formData.bedrooms}
                onChange={handleInputChange}
                required
                min="1"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="bathrooms" className="block text-sm font-medium text-gray-700">
                Bathrooms *
              </label>
              <input
                type="number"
                name="bathrooms"
                id="bathrooms"
                value={formData.bathrooms}
                onChange={handleInputChange}
                required
                min="1"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="area" className="block text-sm font-medium text-gray-700">
                Area (sq ft) *
              </label>
              <input
                type="number"
                name="area"
                id="area"
                value={formData.area}
                onChange={handleInputChange}
                required
                min="1"
                step="0.01"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="ownerId" className="block text-sm font-medium text-gray-700">
                Owner *
              </label>
              <select
                name="ownerId"
                id="ownerId"
                value={formData.ownerId}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="">Select an owner</option>
                {owners.map((owner) => (
                  <option key={owner.id} value={owner.id}>
                    {owner.firstName} {owner.lastName} ({owner.email})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="tenantId" className="block text-sm font-medium text-gray-700">
                Assign Tenant (Optional)
              </label>
              <select
                name="tenantId"
                id="tenantId"
                value={formData.tenantId}
                onChange={handleInputChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="">No tenant assigned</option>
                {tenants.map((tenant) => (
                  <option key={tenant.id} value={tenant.id}>
                    {tenant.firstName} {tenant.lastName} ({tenant.email})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Lease Creation Section */}
          {formData.tenantId && (
            <div className="mt-6 border-t border-gray-200 pt-6">
              <div className="flex items-center mb-4">
                <input
                  type="checkbox"
                  name="createLease"
                  id="createLease"
                  checked={formData.createLease}
                  onChange={(e) => setFormData(prev => ({ ...prev, createLease: e.target.checked }))}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="createLease" className="ml-2 block text-sm font-medium text-gray-700">
                  Create lease for assigned tenant
                </label>
              </div>

              {formData.createLease && (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="monthlyRent" className="block text-sm font-medium text-gray-700">
                      Monthly Rent (₹) *
                    </label>
                    <input
                      type="number"
                      name="monthlyRent"
                      id="monthlyRent"
                      value={formData.monthlyRent}
                      onChange={handleInputChange}
                      required={formData.createLease}
                      min="1"
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>

                  <div>
                    <label htmlFor="securityDeposit" className="block text-sm font-medium text-gray-700">
                      Security Deposit (₹)
                    </label>
                    <input
                      type="number"
                      name="securityDeposit"
                      id="securityDeposit"
                      value={formData.securityDeposit}
                      onChange={handleInputChange}
                      min="0"
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>

                  <div>
                    <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                      Lease Start Date *
                    </label>
                    <input
                      type="date"
                      name="startDate"
                      id="startDate"
                      value={formData.startDate}
                      onChange={handleInputChange}
                      required={formData.createLease}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>

                  <div>
                    <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
                      Lease End Date *
                    </label>
                    <input
                      type="date"
                      name="endDate"
                      id="endDate"
                      value={formData.endDate}
                      onChange={handleInputChange}
                      required={formData.createLease}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="mt-6 flex justify-end space-x-3">
            <Link
              to={`/dashboard/flats/${flat.id}`}
              className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FlatEdit;