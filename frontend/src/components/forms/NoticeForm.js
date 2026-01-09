import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../../services/api';

const NoticeForm = ({ noticeId = null }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    targetRoles: [],
    isPinned: false,
    expiryDate: ''
  });

  const roleOptions = [
    { value: 'OWNER', label: 'Owners' },
    { value: 'TENANT', label: 'Tenants' },
    { value: 'STAFF', label: 'Staff' },
    { value: 'GUARD', label: 'Guards' },
    { value: 'ALL', label: 'All Residents' }
  ];

  useEffect(() => {
    if (noticeId) {
      fetchNotice();
    }
  }, [noticeId]);

  const fetchNotice = async () => {
    try {
      const response = await apiService.notices.getById(noticeId);
      const notice = response.data.data.notice;
      setFormData({
        title: notice.title,
        content: notice.content,
        targetRoles: Array.isArray(notice.targetRoles) ? notice.targetRoles : (notice.targetRoles ? notice.targetRoles.split(',') : []),
        isPinned: notice.isPinned,
        expiryDate: notice.expiryDate ? new Date(notice.expiryDate).toISOString().split('T')[0] : ''
      });
    } catch (error) {
      console.error('Error fetching notice:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleRoleChange = (role) => {
    setFormData(prev => ({
      ...prev,
      targetRoles: prev.targetRoles.includes(role)
        ? prev.targetRoles.filter(r => r !== role)
        : [...prev.targetRoles, role]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const submitData = {
        ...formData,
        expiryDate: formData.expiryDate || null
      };

      if (noticeId) {
        await apiService.notices.update(noticeId, submitData);
      } else {
        await apiService.notices.create(submitData);
      }

      navigate('/dashboard/notices');
    } catch (error) {
      console.error('Error saving notice:', error);
      alert('Failed to save notice. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-6">
            {noticeId ? 'Edit Notice' : 'Create New Notice'}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Enter notice title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Content
              </label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleChange}
                required
                rows={6}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Enter notice content"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Target Audience
              </label>
              <div className="space-y-2">
                {roleOptions.map(role => (
                  <label key={role.value} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.targetRoles.includes(role.value)}
                      onChange={() => handleRoleChange(role.value)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">{role.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="isPinned"
                    checked={formData.isPinned}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Pin this notice</span>
                </label>
                <p className="mt-1 text-xs text-gray-500">
                  Pinned notices appear at the top of the notice board
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Expiry Date (Optional)
                </label>
                <input
                  type="date"
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Notice will be automatically hidden after this date
                </p>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => navigate('/dashboard/notices')}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {loading ? 'Saving...' : (noticeId ? 'Update Notice' : 'Create Notice')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NoticeForm;