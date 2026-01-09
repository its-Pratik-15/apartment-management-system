import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

const VisitorForm = ({ visitorId = null }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [flats, setFlats] = useState([]);
  const [formData, setFormData] = useState({
    visitorName: '',
    visitorPhone: '',
    purpose: '',
    expectedArrival: '',
    flatId: ''
  });

  useEffect(() => {
    if (user.role === 'GUARD') {
      fetchFlats();
    }
    if (visitorId) {
      fetchVisitor();
    }
  }, [visitorId, user.role]);

  const fetchFlats = async () => {
    try {
      const response = await apiService.flats.getAll({ limit: 100 });
      setFlats(response.data.data.flats);
    } catch (error) {
      console.error('Error fetching flats:', error);
    }
  };

  const fetchVisitor = async () => {
    try {
      const response = await apiService.visitors.getById(visitorId);
      const visitor = response.data.data.visitor;
      setFormData({
        visitorName: visitor.visitorName,
        visitorPhone: visitor.visitorPhone || '',
        purpose: visitor.purpose,
        expectedArrival: new Date(visitor.expectedArrival).toISOString().slice(0, 16),
        flatId: visitor.flatId
      });
    } catch (error) {
      console.error('Error fetching visitor:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const submitData = {
        ...formData,
        expectedArrival: new Date(formData.expectedArrival).toISOString()
      };

      if (visitorId) {
        await apiService.visitors.update(visitorId, submitData);
      } else {
        await apiService.visitors.create(submitData);
      }

      navigate('/dashboard/visitors');
    } catch (error) {
      console.error('Error saving visitor:', error);
      alert('Failed to save visitor. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-6">
            {visitorId ? 'Edit Visitor' : (user.role === 'GUARD' ? 'Register Visitor' : 'Request Visitor Entry')}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Visitor Name
                </label>
                <input
                  type="text"
                  name="visitorName"
                  value={formData.visitorName}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Full name of the visitor"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="visitorPhone"
                  value={formData.visitorPhone}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="+91-9876543210"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Purpose of Visit
              </label>
              <input
                type="text"
                name="purpose"
                value={formData.purpose}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="e.g., Family visit, Delivery, Maintenance"
              />
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Expected Arrival
                </label>
                <input
                  type="datetime-local"
                  name="expectedArrival"
                  value={formData.expectedArrival}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {user.role === 'GUARD' ? 'Visiting Flat' : 'Your Flat'}
                </label>
                {user.role === 'GUARD' ? (
                  <select
                    name="flatId"
                    value={formData.flatId}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option value="">Select Flat</option>
                    {flats.map(flat => (
                      <option key={flat.id} value={flat.id}>
                        Flat {flat.flatNumber} - {flat.owner?.firstName} {flat.owner?.lastName}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    value="Your registered flat"
                    disabled
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 text-gray-500 sm:text-sm"
                  />
                )}
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => navigate('/dashboard/visitors')}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {loading ? 'Saving...' : (visitorId ? 'Update Visitor' : (user.role === 'GUARD' ? 'Register Visitor' : 'Request Entry'))}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VisitorForm;