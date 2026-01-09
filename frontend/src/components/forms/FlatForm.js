import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../../services/api';

const FlatForm = ({ flatId = null }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [owners, setOwners] = useState([]);
  const [formData, setFormData] = useState({
    flatNumber: '',
    floor: '',
    bedrooms: '',
    bathrooms: '',
    area: '',
    occupancyStatus: 'VACANT',
    ownerId: ''
  });

  useEffect(() => {
    fetchOwners();
    if (flatId) {
      fetchFlat();
    }
  }, [flatId]);

  const fetchOwners = async () => {
    try {
      const response = await apiService.users.getByRole('OWNER');
      setOwners(response.data.data.users);
    } catch (error) {
      console.error('Error fetching owners:', error);
    }
  };

  const fetchFlat = async () => {
    try {
      const response = await apiService.flats.getById(flatId);
      const flat = response.data.data.flat;
      setFormData({
        flatNumber: flat.flatNumber,
        floor: flat.floor.toString(),
        bedrooms: flat.bedrooms.toString(),
        bathrooms: flat.bathrooms.toString(),
        area: flat.area.toString(),
        occupancyStatus: flat.occupancyStatus,
        ownerId: flat.ownerId
      });
    } catch (error) {
      console.error('Error fetching flat:', error);
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
        floor: parseInt(formData.floor),
        bedrooms: parseInt(formData.bedrooms),
        bathrooms: parseInt(formData.bathrooms),
        area: parseFloat(formData.area)
      };

      if (flatId) {
        await apiService.flats.update(flatId, submitData);
      } else {
        await apiService.flats.create(submitData);
      }

      navigate('/dashboard/flats');
    } catch (error) {
      console.error('Error saving flat:', error);
      alert('Failed to save flat. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-6">
            {flatId ? 'Edit Flat' : 'Add New Flat'}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Flat Number
                </label>
                <input
                  type="text"
                  name="flatNumber"
                  value={formData.flatNumber}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="e.g., A101"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Floor
                </label>
                <input
                  type="number"
                  name="floor"
                  value={formData.floor}
                  onChange={handleChange}
                  required
                  min="0"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Bedrooms
                </label>
                <input
                  type="number"
                  name="bedrooms"
                  value={formData.bedrooms}
                  onChange={handleChange}
                  required
                  min="1"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Bathrooms
                </label>
                <input
                  type="number"
                  name="bathrooms"
                  value={formData.bathrooms}
                  onChange={handleChange}
                  required
                  min="1"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Area (sq ft)
                </label>
                <input
                  type="number"
                  name="area"
                  value={formData.area}
                  onChange={handleChange}
                  required
                  min="1"
                  step="0.1"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Occupancy Status
                </label>
                <select
                  name="occupancyStatus"
                  value={formData.occupancyStatus}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="VACANT">Vacant</option>
                  <option value="OWNER_OCCUPIED">Owner Occupied</option>
                  <option value="TENANT_OCCUPIED">Tenant Occupied</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Owner
                </label>
                <select
                  name="ownerId"
                  value={formData.ownerId}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="">Select Owner</option>
                  {owners.map(owner => (
                    <option key={owner.id} value={owner.id}>
                      {owner.firstName} {owner.lastName} ({owner.email})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => navigate('/dashboard/flats')}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {loading ? 'Saving...' : (flatId ? 'Update Flat' : 'Create Flat')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FlatForm;