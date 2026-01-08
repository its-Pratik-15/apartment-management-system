import React from 'react';

const GuardDashboard = () => {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Guard Dashboard</h1>
        <p className="mt-1 text-sm text-gray-600">
          Mobile-optimized interface for visitor management
        </p>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Coming Soon</h2>
        <p className="text-gray-600">
          Guard dashboard features will include:
        </p>
        <ul className="mt-4 space-y-2 text-gray-600">
          <li>• Mobile-first entry forms</li>
          <li>• Pending visitor approvals</li>
          <li>• IN/OUT buttons</li>
          <li>• Emergency alerts</li>
          <li>• View notices</li>
        </ul>
      </div>
    </div>
  );
};

export default GuardDashboard;