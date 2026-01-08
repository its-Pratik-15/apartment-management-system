import React from 'react';

const OwnerDashboard = () => {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Owner Dashboard</h1>
        <p className="mt-1 text-sm text-gray-600">
          Manage your properties and view tenant information
        </p>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Coming Soon</h2>
        <p className="text-gray-600">
          Owner dashboard features will include:
        </p>
        <ul className="mt-4 space-y-2 text-gray-600">
          <li>• View maintenance bills</li>
          <li>• Manage tenant details</li>
          <li>• Track rent received</li>
          <li>• View notices</li>
          <li>• Raise issues</li>
        </ul>
      </div>
    </div>
  );
};

export default OwnerDashboard;