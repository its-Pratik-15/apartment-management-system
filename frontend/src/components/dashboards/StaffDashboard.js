import React from 'react';

const StaffDashboard = () => {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Staff Dashboard</h1>
        <p className="mt-1 text-sm text-gray-600">
          Manage issues and stay updated with notices
        </p>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Coming Soon</h2>
        <p className="text-gray-600">
          Staff dashboard features will include:
        </p>
        <ul className="mt-4 space-y-2 text-gray-600">
          <li>• View and update issues</li>
          <li>• Track issue resolution</li>
          <li>• View notices</li>
        </ul>
      </div>
    </div>
  );
};

export default StaffDashboard;