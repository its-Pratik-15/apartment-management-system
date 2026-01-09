import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const Visitors = () => {
  const { user } = useAuth();
  const [visitors, setVisitors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    isApproved: ''
  });

  useEffect(() => {
    fetchVisitors();
  }, [filters]);

  const fetchVisitors = async () => {
    try {
      setLoading(true);
      const response = await apiService.visitors.getAll(filters);
      setVisitors(response.data.data.visitors);
      setPagination(response.data.data.pagination);
    } catch (error) {
      console.error('Error fetching visitors:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1
    }));
  };

  const handlePageChange = (newPage) => {
    setFilters(prev => ({
      ...prev,
      page: newPage
    }));
  };

  const handleUpdateStatus = async (visitorId, isApproved) => {
    try {
      await apiService.visitors.updateStatus(visitorId, { isApproved });
      fetchVisitors();
    } catch (error) {
      console.error('Error updating visitor status:', error);
      alert('Failed to update visitor status. Please try again.');
    }
  };

  const handleRecordCheckIn = async (visitorId) => {
    try {
      await apiService.visitors.recordCheckIn(visitorId);
      fetchVisitors();
    } catch (error) {
      console.error('Error recording check-in:', error);
      alert('Failed to record visitor check-in. Please try again.');
    }
  };

  const handleRecordExit = async (visitorId) => {
    try {
      await apiService.visitors.recordExit(visitorId);
      fetchVisitors();
    } catch (error) {
      console.error('Error recording exit:', error);
      alert('Failed to record visitor exit. Please try again.');
    }
  };

  const getStatusBadgeColor = (visitor) => {
    if (visitor.isApproved === null) {
      return 'bg-yellow-100 text-yellow-800';
    } else if (visitor.isApproved === true) {
      if (visitor.outTime) {
        return 'bg-gray-100 text-gray-800';
      } else if (visitor.inTime) {
        return 'bg-blue-100 text-blue-800';
      } else {
        return 'bg-green-100 text-green-800';
      }
    } else {
      return 'bg-red-100 text-red-800';
    }
  };

  const getStatusText = (visitor) => {
    if (visitor.isApproved === null) {
      return 'Pending';
    } else if (visitor.isApproved === true) {
      if (visitor.outTime) {
        return 'Checked Out';
      } else if (visitor.inTime) {
        return 'Checked In';
      } else {
        return 'Approved';
      }
    } else {
      return 'Rejected';
    }
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
          <h1 className="text-2xl font-bold text-gray-900">Visitors</h1>
          <p className="mt-1 text-sm text-gray-600">
            {user.role === 'GUARD' ? 'Manage visitor entries and exits' : 
             user.role === 'SECRETARY' ? 'Monitor all visitor activities' : 
             'Manage your visitor requests'}
          </p>
        </div>
        {(user.role === 'OWNER' || user.role === 'TENANT' || user.role === 'GUARD') && (
          <div className="mt-4 sm:mt-0">
            <Link
              to="/dashboard/visitors/new"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              {user.role === 'GUARD' ? 'Register Visitor' : 'Request Visitor'}
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
                Status
              </label>
              <select
                value={filters.isApproved}
                onChange={(e) => handleFilterChange('isApproved', e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="">All Status</option>
                <option value="null">Pending</option>
                <option value="true">Approved</option>
                <option value="false">Rejected</option>
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

      {/* Visitors List */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {visitors.map((visitor) => (
            <li key={visitor.id}>
              <div className="px-4 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 bg-purple-500 rounded-lg flex items-center justify-center">
                        <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="flex items-center">
                        <div className="text-sm font-medium text-gray-900">
                          {visitor.visitorName}
                        </div>
                        <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(visitor)}`}>
                          {getStatusText(visitor)}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        Phone: {visitor.visitorPhone}
                        {visitor.purpose && (
                          <>
                            <span className="mx-2">•</span>
                            Purpose: {visitor.purpose}
                          </>
                        )}
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        Visiting: {visitor.flat?.flatNumber && `Flat ${visitor.flat.flatNumber}`}
                        {visitor.host && (
                          <>
                            <span className="mx-2">•</span>
                            Host: {visitor.host.firstName} {visitor.host.lastName}
                          </>
                        )}
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        Created: {new Date(visitor.createdAt).toLocaleString()}
                        {visitor.inTime && (
                          <>
                            <span className="mx-2">•</span>
                            Arrived: {new Date(visitor.inTime).toLocaleString()}
                          </>
                        )}
                        {visitor.outTime && (
                          <>
                            <span className="mx-2">•</span>
                            Departed: {new Date(visitor.outTime).toLocaleString()}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {/* Guard Actions */}
                    {user.role === 'GUARD' && (
                      <>
                        {visitor.isApproved === true && !visitor.inTime && (
                          <button
                            onClick={() => handleRecordCheckIn(visitor.id)}
                            className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                          >
                            Check In
                          </button>
                        )}
                        {visitor.isApproved === true && visitor.inTime && !visitor.outTime && (
                          <button
                            onClick={() => handleRecordExit(visitor.id)}
                            className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                            Check Out
                          </button>
                        )}
                      </>
                    )}
                    
                    {/* Host Actions */}
                    {(user.role === 'OWNER' || user.role === 'TENANT') && visitor.isApproved === null && (
                      <>
                        <button
                          onClick={() => handleUpdateStatus(visitor.id, true)}
                          className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(visitor.id, false)}
                          className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                          Reject
                        </button>
                      </>
                    )}
                    
                    <Link
                      to={`/dashboard/visitors/${visitor.id}`}
                      className="text-blue-600 hover:text-blue-500 text-sm font-medium"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>

        {visitors.length === 0 && (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No visitors found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {user.role === 'GUARD' ? 'No visitor entries recorded yet.' : 'No visitor requests found.'}
            </p>
          </div>
        )}
      </div>

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
    </div>
  );
};

export default Visitors;