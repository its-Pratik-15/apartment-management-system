import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';

const FlatDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [flat, setFlat] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchFlatDetails();
  }, [id]);

  const fetchFlatDetails = async () => {
    try {
      setLoading(true);
      const response = await apiService.flats.getById(id);
      setFlat(response.data.data.flat);
    } catch (error) {
      console.error('Error fetching flat details:', error);
      setError('Failed to load flat details');
    } finally {
      setLoading(false);
    }
  };

  const getOccupancyBadgeColor = (status) => {
    const colors = {
      VACANT: 'bg-gray-100 text-gray-800',
      OWNER_OCCUPIED: 'bg-blue-100 text-blue-800',
      TENANT_OCCUPIED: 'bg-green-100 text-green-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getOccupancyStatusText = (status) => {
    const statusText = {
      VACANT: 'Vacant',
      OWNER_OCCUPIED: 'Owner Occupied',
      TENANT_OCCUPIED: 'Tenant Occupied'
    };
    return statusText[status] || status;
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
    <div className="max-w-4xl mx-auto">
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
                <span className="ml-4 text-sm font-medium text-gray-500">Flat {flat.flatNumber}</span>
              </div>
            </li>
          </ol>
        </nav>
        
        <div className="mt-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Flat {flat.flatNumber}</h1>
            <p className="mt-1 text-sm text-gray-600">Floor {flat.floor}</p>
          </div>
          <div className="flex space-x-3">
            <Link
              to={`/dashboard/flats/${flat.id}/edit`}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Details */}
        <div className="lg:col-span-2">
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                Flat Details
              </h3>
              
              <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Flat Number</dt>
                  <dd className="mt-1 text-sm text-gray-900">{flat.flatNumber}</dd>
                </div>
                
                <div>
                  <dt className="text-sm font-medium text-gray-500">Floor</dt>
                  <dd className="mt-1 text-sm text-gray-900">{flat.floor}</dd>
                </div>
                
                <div>
                  <dt className="text-sm font-medium text-gray-500">Bedrooms</dt>
                  <dd className="mt-1 text-sm text-gray-900">{flat.bedrooms}</dd>
                </div>
                
                <div>
                  <dt className="text-sm font-medium text-gray-500">Bathrooms</dt>
                  <dd className="mt-1 text-sm text-gray-900">{flat.bathrooms}</dd>
                </div>
                
                <div>
                  <dt className="text-sm font-medium text-gray-500">Area</dt>
                  <dd className="mt-1 text-sm text-gray-900">{flat.area} sq ft</dd>
                </div>
                
                <div>
                  <dt className="text-sm font-medium text-gray-500">Occupancy Status</dt>
                  <dd className="mt-1">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getOccupancyBadgeColor(flat.occupancyStatus)}`}>
                      {getOccupancyStatusText(flat.occupancyStatus)}
                    </span>
                  </dd>
                </div>
                
                <div className="sm:col-span-2">
                  <dt className="text-sm font-medium text-gray-500">Created</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {new Date(flat.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>

        {/* Owner Information */}
        <div>
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                Owner Information
              </h3>
              
              {flat.owner ? (
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="h-10 w-10 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-white">
                        {flat.owner.firstName.charAt(0)}{flat.owner.lastName.charAt(0)}
                      </span>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">
                        {flat.owner.firstName} {flat.owner.lastName}
                      </p>
                      <p className="text-sm text-gray-500">{flat.owner.email}</p>
                    </div>
                  </div>
                  
                  {flat.owner.phone && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Phone</dt>
                      <dd className="mt-1 text-sm text-gray-900">{flat.owner.phone}</dd>
                    </div>
                  )}
                  
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Role</dt>
                    <dd className="mt-1 text-sm text-gray-900">{flat.owner.role}</dd>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-500">No owner assigned</p>
              )}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="mt-6 bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                Quick Stats
              </h3>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Active Leases</span>
                  <span className="text-sm font-medium text-gray-900">
                    {flat.leases?.filter(lease => lease.isActive).length || 0}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Total Bills</span>
                  <span className="text-sm font-medium text-gray-900">
                    {flat.bills?.length || 0}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Visitor Logs</span>
                  <span className="text-sm font-medium text-gray-900">
                    {flat.visitorLogs?.length || 0}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlatDetails;