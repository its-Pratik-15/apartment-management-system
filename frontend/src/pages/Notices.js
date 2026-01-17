import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { showSuccess, showError, showLoading, dismissToast } from '../components/ErrorMessage';
import ConfirmDialog from '../components/ConfirmDialog';

const Notices = () => {
  const { user } = useAuth();
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    isPinned: ''
  });
  const [deleteDialog, setDeleteDialog] = useState({
    isOpen: false,
    noticeId: null,
    noticeTitle: ''
  });

  useEffect(() => {
    fetchNotices();
  }, [filters]);

  const fetchNotices = async () => {
    try {
      setLoading(true);
      const response = await apiService.notices.getAll(filters);
      setNotices(response.data.data.notices);
      setPagination(response.data.data.pagination);
    } catch (error) {
      console.error('Error fetching notices:', error);
      showError('Failed to load notices. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value === '' ? '' : value,
      page: 1
    }));
  };

  const handlePageChange = (newPage) => {
    setFilters(prev => ({
      ...prev,
      page: newPage
    }));
  };

  const handleTogglePin = async (noticeId) => {
    const loadingToast = showLoading('Updating notice pin status...');
    
    try {
      await apiService.notices.togglePin(noticeId);
      dismissToast(loadingToast);
      showSuccess('Notice pin status updated successfully!');
      fetchNotices();
    } catch (error) {
      console.error('Error toggling pin:', error);
      dismissToast(loadingToast);
      showError('Failed to update notice pin status. Please try again.');
    }
  };

  const handleDeleteNotice = async (noticeId) => {
    setDeleteDialog({
      isOpen: true,
      noticeId,
      noticeTitle: notices.find(n => n.id === noticeId)?.title || 'this notice'
    });
  };

  const confirmDelete = async () => {
    const loadingToast = showLoading('Deleting notice...');
    
    try {
      await apiService.notices.delete(deleteDialog.noticeId);
      dismissToast(loadingToast);
      showSuccess('Notice deleted successfully!');
      fetchNotices();
      setDeleteDialog({ isOpen: false, noticeId: null, noticeTitle: '' });
    } catch (error) {
      console.error('Error deleting notice:', error);
      dismissToast(loadingToast);
      showError('Failed to delete notice. Please try again.');
    }
  };

  const cancelDelete = () => {
    setDeleteDialog({ isOpen: false, noticeId: null, noticeTitle: '' });
  };

  const getTargetRolesBadges = (targetRoles) => {
    if (!targetRoles || targetRoles.length === 0) return null;
    
    // Handle both string (legacy) and array formats
    const roles = Array.isArray(targetRoles) ? targetRoles : targetRoles.split(',');
    
    const colors = {
      OWNER: 'bg-blue-100 text-blue-800',
      TENANT: 'bg-green-100 text-green-800',
      STAFF: 'bg-yellow-100 text-yellow-800',
      GUARD: 'bg-gray-100 text-gray-800',
      ALL: 'bg-purple-100 text-purple-800'
    };

    return roles.map(role => (
      <span key={role} className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mr-1 ${colors[role] || 'bg-gray-100 text-gray-800'}`}>
        {role}
      </span>
    ));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="sm:flex sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notices</h1>
          <p className="mt-1 text-sm text-gray-600">
            {user.role === 'SECRETARY' ? 'Manage all notices in the system' : 'View notices and announcements'}
          </p>
        </div>
        {user.role === 'SECRETARY' && (
          <div className="mt-4 sm:mt-0">
            <Link
              to="/dashboard/notices/new"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Create Notice
            </Link>
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white shadow rounded-lg mb-6">
        <div className="px-4 py-5 sm:p-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pin Status
              </label>
              <select
                value={filters.isPinned}
                onChange={(e) => handleFilterChange('isPinned', e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="">All Notices</option>
                <option value="true">Pinned Only</option>
                <option value="false">Unpinned Only</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Per Page
              </label>
              <select
                value={filters.limit}
                onChange={(e) => handleFilterChange('limit', parseInt(e.target.value))}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Notices List */}
      <div className="space-y-4">
        {notices.map((notice) => (
          <div key={notice.id} className="bg-white shadow rounded-lg overflow-hidden">
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <h3 className="text-lg font-medium text-gray-900 mr-3">
                      {notice.title}
                    </h3>
                    {notice.isPinned && (
                      <svg className="h-5 w-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {notice.content}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center space-x-4">
                      <span>By: {notice.author?.firstName} {notice.author?.lastName}</span>
                      <span>•</span>
                      <span>{new Date(notice.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="mr-2">Target:</span>
                      {getTargetRolesBadges(notice.targetRoles)}
                    </div>
                  </div>
                </div>
                
                {user.role === 'SECRETARY' && (
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => handleTogglePin(notice.id)}
                      className={`inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded ${
                        notice.isPinned
                          ? 'text-yellow-800 bg-yellow-100 hover:bg-yellow-200'
                          : 'text-gray-600 bg-gray-100 hover:bg-gray-200'
                      } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500`}
                    >
                      {notice.isPinned ? 'Unpin' : 'Pin'}
                    </button>
                    <Link
                      to={`/dashboard/notices/${notice.id}/edit`}
                      className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded text-blue-600 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDeleteNotice(notice.id)}
                      className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded text-red-600 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {notices.length === 0 && (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No notices found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {user.role === 'SECRETARY' ? 'Get started by creating a new notice.' : 'No notices available at the moment.'}
          </p>
        </div>
      )}

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 mt-6 rounded-lg shadow">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.pages}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{((pagination.page - 1) * pagination.limit) + 1}</span> to{' '}
                <span className="font-medium">
                  {Math.min(pagination.page * pagination.limit, pagination.total)}
                </span>{' '}
                of <span className="font-medium">{pagination.total}</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                {Array.from({ length: Math.min(pagination.pages, 5) }, (_, i) => {
                  let page;
                  if (pagination.pages <= 5) {
                    page = i + 1;
                  } else if (pagination.page <= 3) {
                    page = i + 1;
                  } else if (pagination.page >= pagination.pages - 2) {
                    page = pagination.pages - 4 + i;
                  } else {
                    page = pagination.page - 2 + i;
                  }
                  return (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        page === pagination.page
                          ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}
                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.pages}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        title="Delete Notice"
        message={`Are you sure you want to delete "${deleteDialog.noticeTitle}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />
    </div>
  );
};

export default Notices;