import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiService } from '../services/api';

const IssueManagementCard = () => {
  const [stats, setStats] = useState({
    total: 0,
    open: 0,
    inProgress: 0,
    resolved: 0,
    highPriority: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await apiService.issues.getStats();
      setStats(response.data.data.stats);
    } catch (error) {
      console.error('Error fetching issue stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="p-5">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="space-y-2">
              <div className="h-3 bg-gray-200 rounded"></div>
              <div className="h-3 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="h-8 w-8 bg-red-500 rounded-md flex items-center justify-center">
              <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">
                Issue Management
              </dt>
              <dd className="text-lg font-medium text-gray-900">
                {stats.total} Total Issues
              </dd>
            </dl>
          </div>
        </div>
      </div>
      <div className="bg-gray-50 px-5 py-3">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-red-600 font-medium">{stats.open}</span>
            <span className="text-gray-500 ml-1">Open</span>
          </div>
          <div>
            <span className="text-yellow-600 font-medium">{stats.inProgress}</span>
            <span className="text-gray-500 ml-1">In Progress</span>
          </div>
          <div>
            <span className="text-green-600 font-medium">{stats.resolved}</span>
            <span className="text-gray-500 ml-1">Resolved</span>
          </div>
          <div>
            <span className="text-orange-600 font-medium">{stats.highPriority}</span>
            <span className="text-gray-500 ml-1">High Priority</span>
          </div>
        </div>
        <div className="mt-3">
          <Link
            to="/dashboard/issues"
            className="text-sm font-medium text-blue-600 hover:text-blue-500"
          >
            Manage Issues →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default IssueManagementCard;