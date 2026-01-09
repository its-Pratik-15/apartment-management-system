import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiService } from '../../services/api';

const GuardDashboard = () => {
  const [stats, setStats] = useState({
    pendingApprovals: 0,
    todayVisitors: 0,
    currentlyInside: 0,
    totalToday: 0
  });
  const [pendingVisitors, setPendingVisitors] = useState([]);
  const [todayVisitors, setTodayVisitors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({});

  useEffect(() => {
    fetchDashboardData();
    // Refresh data every 30 seconds
    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const today = new Date().toISOString().split('T')[0];
      
      const [pendingRes, todayRes] = await Promise.all([
        apiService.visitors.getPending(),
        apiService.visitors.getAll({ date: today, limit: 50 })
      ]);

      const pending = pendingRes.data.data.pendingVisitors || [];
      const todayData = todayRes.data.data.visitors || [];

      setPendingVisitors(pending);
      setTodayVisitors(todayData);

      // Calculate stats
      const currentlyInside = todayData.filter(v => 
        v.isApproved === true && v.inTime && !v.outTime
      ).length;

      setStats({
        pendingApprovals: pending.length,
        todayVisitors: todayData.length,
        currentlyInside,
        totalToday: todayData.filter(v => v.isApproved === true).length
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async (visitorId) => {
    try {
      setActionLoading(prev => ({ ...prev, [visitorId]: 'checkin' }));
      await apiService.visitors.recordCheckIn(visitorId);
      await fetchDashboardData();
    } catch (error) {
      console.error('Error checking in visitor:', error);
      alert('Failed to check in visitor. Please try again.');
    } finally {
      setActionLoading(prev => ({ ...prev, [visitorId]: null }));
    }
  };

  const handleCheckOut = async (visitorId) => {
    try {
      setActionLoading(prev => ({ ...prev, [visitorId]: 'checkout' }));
      await apiService.visitors.recordExit(visitorId);
      await fetchDashboardData();
    } catch (error) {
      console.error('Error checking out visitor:', error);
      alert('Failed to check out visitor. Please try again.');
    } finally {
      setActionLoading(prev => ({ ...prev, [visitorId]: null }));
    }
  };

  const getVisitorStatus = (visitor) => {
    if (visitor.isApproved === null) return { text: 'Pending', color: 'bg-yellow-100 text-yellow-800' };
    if (visitor.isApproved === false) return { text: 'Rejected', color: 'bg-red-100 text-red-800' };
    if (!visitor.inTime) return { text: 'Approved', color: 'bg-green-100 text-green-800' };
    if (visitor.inTime && !visitor.outTime) return { text: 'Inside', color: 'bg-blue-100 text-blue-800' };
    return { text: 'Completed', color: 'bg-gray-100 text-gray-800' };
  };

  const StatCard = ({ title, value, subtitle, icon, color = 'blue' }) => (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className={`h-8 w-8 bg-${color}-500 rounded-md flex items-center justify-center`}>
              {icon}
            </div>
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
              <dd className="text-lg font-medium text-gray-900">{value}</dd>
              {subtitle && <dd className="text-sm text-gray-500">{subtitle}</dd>}
            </dl>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Guard Dashboard</h1>
        <p className="mt-1 text-sm text-gray-600">
          Visitor management and security monitoring
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Pending Approvals"
          value={stats.pendingApprovals}
          subtitle="Awaiting approval"
          icon={
            <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          color="yellow"
        />
        
        <StatCard
          title="Currently Inside"
          value={stats.currentlyInside}
          subtitle="Active visitors"
          icon={
            <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          }
          color="blue"
        />
        
        <StatCard
          title="Today's Visitors"
          value={stats.totalToday}
          subtitle="Approved entries"
          icon={
            <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
          }
          color="green"
        />
        
        <StatCard
          title="Total Entries"
          value={stats.todayVisitors}
          subtitle="All records today"
          icon={
            <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          }
          color="purple"
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Link
              to="/dashboard/visitors/new"
              className="inline-flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Register New Visitor
            </Link>
            
            <Link
              to="/dashboard/visitors"
              className="inline-flex items-center justify-center px-4 py-3 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              View All Visitors
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Approvals */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Pending Approvals ({stats.pendingApprovals})
            </h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {pendingVisitors.length > 0 ? (
                pendingVisitors.map((visitor) => (
                  <div key={visitor.id} className="border border-gray-200 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-gray-900">{visitor.visitorName}</h4>
                        <p className="text-sm text-gray-500">Flat {visitor.flat?.flatNumber}</p>
                        <p className="text-sm text-gray-500">{visitor.purpose}</p>
                        {visitor.visitorPhone && (
                          <p className="text-sm text-gray-500">{visitor.visitorPhone}</p>
                        )}
                      </div>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        Pending
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">No pending approvals</p>
              )}
            </div>
          </div>
        </div>

        {/* Today's Visitors - In/Out Management */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Today's Visitors - In/Out Management
            </h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {todayVisitors.filter(v => v.isApproved === true).length > 0 ? (
                todayVisitors
                  .filter(v => v.isApproved === true)
                  .map((visitor) => {
                    const status = getVisitorStatus(visitor);
                    return (
                      <div key={visitor.id} className="border border-gray-200 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex-1">
                            <h4 className="text-sm font-medium text-gray-900">{visitor.visitorName}</h4>
                            <p className="text-sm text-gray-500">Flat {visitor.flat?.flatNumber}</p>
                            <p className="text-sm text-gray-500">{visitor.purpose}</p>
                            {visitor.inTime && (
                              <p className="text-xs text-gray-400">
                                In: {new Date(visitor.inTime).toLocaleTimeString()}
                              </p>
                            )}
                            {visitor.outTime && (
                              <p className="text-xs text-gray-400">
                                Out: {new Date(visitor.outTime).toLocaleTimeString()}
                              </p>
                            )}
                          </div>
                          <div className="flex flex-col items-end space-y-2">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${status.color}`}>
                              {status.text}
                            </span>
                            
                            {/* Action Buttons */}
                            <div className="flex space-x-1">
                              {!visitor.inTime && (
                                <button
                                  onClick={() => handleCheckIn(visitor.id)}
                                  disabled={actionLoading[visitor.id] === 'checkin'}
                                  className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                                >
                                  {actionLoading[visitor.id] === 'checkin' ? 'Checking In...' : 'Check In'}
                                </button>
                              )}
                              
                              {visitor.inTime && !visitor.outTime && (
                                <button
                                  onClick={() => handleCheckOut(visitor.id)}
                                  disabled={actionLoading[visitor.id] === 'checkout'}
                                  className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                                >
                                  {actionLoading[visitor.id] === 'checkout' ? 'Checking Out...' : 'Check Out'}
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">No approved visitors today</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Refresh Button */}
      <div className="flex justify-center">
        <button
          onClick={fetchDashboardData}
          disabled={loading}
          className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          {loading ? 'Refreshing...' : 'Refresh Data'}
        </button>
      </div>
    </div>
  );
};

export default GuardDashboard;