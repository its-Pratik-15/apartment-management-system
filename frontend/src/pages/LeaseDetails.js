import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';

const LeaseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lease, setLease] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [terminating, setTerminating] = useState(false);

  useEffect(() => {
    fetchLeaseDetails();
  }, [id]);

  const fetchLeaseDetails = async () => {
    try {
      setLoading(true);
      const response = await apiService.leases.getById(id);
      setLease(response.data.data.lease);
    } catch (error) {
      console.error('Error fetching lease details:', error);
      setError('Failed to load lease details');
    } finally {
      setLoading(false);
    }
  };

  const getLeaseStatus = (lease) => {
    const now = new Date();
    const endDate = new Date(lease.endDate);
    const startDate = new Date(lease.startDate);
    
    if (lease.terminationDate) {
      return { status: 'TERMINATED', color: 'bg-red-100 text-red-800' };
    } else if (now < startDate) {
      return { status: 'UPCOMING', color: 'bg-yellow-100 text-yellow-800' };
    } else if (now > endDate) {
      return { status: 'EXPIRED', color: 'bg-gray-100 text-gray-800' };
    } else {
      const daysUntilExpiry = Math.ceil((endDate - now) / (1000 * 60 * 60 * 24));
      if (daysUntilExpiry <= 30) {
        return { status: 'EXPIRING SOON', color: 'bg-orange-100 text-orange-800' };
      }
      return { status: 'ACTIVE', color: 'bg-green-100 text-green-800' };
    }
  };

  const handleTerminateLease = async () => {
    if (!window.confirm('Are you sure you want to terminate this lease? This action cannot be undone.')) {
      return;
    }

    const reason = window.prompt('Please provide a reason for termination:');
    if (!reason) {
      return;
    }

    try {
      setTerminating(true);
      await apiService.leases.terminate(id, {
        terminationDate: new Date().toISOString().split('T')[0],
        reason
      });
      
      // Refresh lease details
      await fetchLeaseDetails();
      alert('Lease terminated successfully');
    } catch (error) {
      console.error('Error terminating lease:', error);
      alert('Failed to terminate lease. Please try again.');
    } finally {
      setTerminating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !lease) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">{error || 'Lease not found'}</div>
        <Link
          to="/dashboard/leases"
          className="text-blue-600 hover:text-blue-500 font-medium"
        >
          ← Back to Leases
        </Link>
      </div>
    );
  }

  const leaseStatus = getLeaseStatus(lease);

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <nav className="flex" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-4">
            <li>
              <Link to="/dashboard/leases" className="text-gray-400 hover:text-gray-500">
                Leases
              </Link>
            </li>
            <li>
              <div className="flex items-center">
                <svg className="flex-shrink-0 h-5 w-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
                <span className="ml-4 text-sm font-medium text-gray-500">Flat {lease.flat?.flatNumber}</span>
              </div>
            </li>
          </ol>
        </nav>
        
        <div className="mt-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Lease Agreement - Flat {lease.flat?.flatNumber}
            </h1>
            <div className="mt-2 flex items-center">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${leaseStatus.color}`}>
                {leaseStatus.status}
              </span>
              <span className="ml-4 text-sm text-gray-500">
                Created on {new Date(lease.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
          <div className="flex space-x-3">
            {!lease.terminationDate && leaseStatus.status === 'ACTIVE' && (
              <button
                onClick={handleTerminateLease}
                disabled={terminating}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
              >
                {terminating ? 'Terminating...' : 'Terminate Lease'}
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Lease Information */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                Lease Information
              </h3>
              
              <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Start Date</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {new Date(lease.startDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </dd>
                </div>
                
                <div>
                  <dt className="text-sm font-medium text-gray-500">End Date</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {new Date(lease.endDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </dd>
                </div>
                
                <div>
                  <dt className="text-sm font-medium text-gray-500">Monthly Rent</dt>
                  <dd className="mt-1 text-sm text-gray-900">₹{lease.monthlyRent?.toLocaleString()}</dd>
                </div>
                
                <div>
                  <dt className="text-sm font-medium text-gray-500">Security Deposit</dt>
                  <dd className="mt-1 text-sm text-gray-900">₹{lease.securityDeposit?.toLocaleString()}</dd>
                </div>
                
                <div>
                  <dt className="text-sm font-medium text-gray-500">Duration</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {Math.ceil((new Date(lease.endDate) - new Date(lease.startDate)) / (1000 * 60 * 60 * 24 * 30))} months
                  </dd>
                </div>
                
                <div>
                  <dt className="text-sm font-medium text-gray-500">Status</dt>
                  <dd className="mt-1">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${leaseStatus.color}`}>
                      {leaseStatus.status}
                    </span>
                  </dd>
                </div>

                {lease.terminationDate && (
                  <>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Termination Date</dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {new Date(lease.terminationDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </dd>
                    </div>
                    
                    {lease.terminationReason && (
                      <div className="sm:col-span-2">
                        <dt className="text-sm font-medium text-gray-500">Termination Reason</dt>
                        <dd className="mt-1 text-sm text-gray-900">{lease.terminationReason}</dd>
                      </div>
                    )}
                  </>
                )}
              </dl>
            </div>
          </div>

          {/* Flat Information */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                Flat Information
              </h3>
              
              <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Flat Number</dt>
                  <dd className="mt-1 text-sm text-gray-900">{lease.flat?.flatNumber}</dd>
                </div>
                
                <div>
                  <dt className="text-sm font-medium text-gray-500">Floor</dt>
                  <dd className="mt-1 text-sm text-gray-900">{lease.flat?.floor}</dd>
                </div>
                
                <div>
                  <dt className="text-sm font-medium text-gray-500">Bedrooms</dt>
                  <dd className="mt-1 text-sm text-gray-900">{lease.flat?.bedrooms}</dd>
                </div>
                
                <div>
                  <dt className="text-sm font-medium text-gray-500">Bathrooms</dt>
                  <dd className="mt-1 text-sm text-gray-900">{lease.flat?.bathrooms}</dd>
                </div>
                
                <div>
                  <dt className="text-sm font-medium text-gray-500">Area</dt>
                  <dd className="mt-1 text-sm text-gray-900">{lease.flat?.area} sq ft</dd>
                </div>
                
                <div>
                  <dt className="text-sm font-medium text-gray-500">Occupancy Status</dt>
                  <dd className="mt-1 text-sm text-gray-900">{lease.flat?.occupancyStatus?.replace('_', ' ')}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Tenant Information */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                Tenant Information
              </h3>
              
              {lease.tenant ? (
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="h-10 w-10 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-white">
                        {lease.tenant.firstName?.charAt(0)}{lease.tenant.lastName?.charAt(0)}
                      </span>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">
                        {lease.tenant.firstName} {lease.tenant.lastName}
                      </p>
                      <p className="text-sm text-gray-500">{lease.tenant.email}</p>
                    </div>
                  </div>
                  
                  {lease.tenant.phone && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Phone</dt>
                      <dd className="mt-1 text-sm text-gray-900">{lease.tenant.phone}</dd>
                    </div>
                  )}
                  
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Role</dt>
                    <dd className="mt-1 text-sm text-gray-900">{lease.tenant.role}</dd>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-500">No tenant information available</p>
              )}
            </div>
          </div>

          {/* Owner Information */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                Owner Information
              </h3>
              
              {lease.flat?.owner ? (
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="h-10 w-10 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-white">
                        {lease.flat.owner.firstName?.charAt(0)}{lease.flat.owner.lastName?.charAt(0)}
                      </span>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">
                        {lease.flat.owner.firstName} {lease.flat.owner.lastName}
                      </p>
                      <p className="text-sm text-gray-500">{lease.flat.owner.email}</p>
                    </div>
                  </div>
                  
                  {lease.flat.owner.phone && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Phone</dt>
                      <dd className="mt-1 text-sm text-gray-900">{lease.flat.owner.phone}</dd>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No owner information available</p>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                Quick Actions
              </h3>
              
              <div className="space-y-3">
                <Link
                  to={`/dashboard/bills?flatId=${lease.flatId}`}
                  className="block w-full text-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  View Bills
                </Link>
                
                <Link
                  to={`/dashboard/visitors?flatId=${lease.flatId}`}
                  className="block w-full text-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  View Visitors
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaseDetails;