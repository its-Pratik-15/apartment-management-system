import React from 'react';

const TenantDashboard = () => {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Tenant Dashboard</h1>
        <p className="mt-1 text-sm text-gray-600">
          View your bills, manage visitors, and stay updated
        </p>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Coming Soon</h2>
        <p className="text-gray-600">
          Tenant dashboard features will include:
        </p>
        <ul className="mt-4 space-y-2 text-gray-600">
          <li>• View and pay rent & utility bills</li>
          <li>• Approve visitors</li>
          <li>• Raise issues</li>
          <li>• View notices</li>
        </ul>
      </div>
    </div>
  );
};

export default TenantDashboard;