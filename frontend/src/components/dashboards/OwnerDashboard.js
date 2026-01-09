import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiService } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { showError, showWarning } from '../ErrorMessage';

const OwnerDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    flats: { owned: 0 },
    bills: { total: 0, overdue: 0, totalAmount: 0, pendingAmount: 0 },
    leases: { active: 0 },
    issues: { total: 0, open: 0 },
    visitors: { pending: 0 }
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [flatsRes, billsRes, issuesRes, visitorsRes, leasesRes] = await Promise.all([
          apiService.flats.getAll({ ownerId: user.id }),
          apiService.bills.getAll({ userId: user.id, limit: 1 }),
          apiService.issues.getAll({ reporterId: user.id, limit: 1 }),
          apiService.visitors.getPending(),
          apiService.leases.getAll({ limit: 100 }) // Get all to filter by owned flats
        ]);

        // Get owned flat IDs with defensive handling
        const ownedFlats = flatsRes.data?.data?.flats || [];
        const ownedFlatIds = ownedFlats.map(flat => flat.id);
        
        // Filter leases for owned flats with defensive handling
        const allLeases = leasesRes.data?.data?.leases || [];
        const ownedLeases = allLeases.filter(lease => 
          ownedFlatIds.includes(lease.flatId) && lease.isActive
        );

        // Get bills summary for owned flats only if there are owned flats
        let totalBills = 0;
        let overdueBills = 0;
        let totalAmount = 0;
        let pendingAmount = 0;

        if (ownedFlatIds.length > 0) {
          try {
            const billsSummary = await apiService.bills.getAll({ 
              flatId: ownedFlatIds.join(','), 
              limit: 100 
            });

            const bills = billsSummary.data?.data?.bills || [];
            totalBills = bills.length;
            overdueBills = bills.filter(bill => bill.status === 'OVERDUE').length;
            totalAmount = bills.reduce((sum, bill) => sum + (bill.amount || 0), 0);
            pendingAmount = bills
              .filter(bill => bill.status !== 'PAID')
              .reduce((sum, bill) => sum + (bill.amount || 0), 0);
          } catch (billsError) {
            console.warn('Error fetching bills summary:', billsError);
            // Continue with default values
          }
        }

        // Handle issues data with defensive checks
        const issuesData = issuesRes.data?.data || {};
        const issuesList = issuesData.issues || [];
        const issuesPagination = issuesData.pagination || {};

        // Handle visitors data with defensive checks
        const visitorsData = visitorsRes.data?.data || {};

        setStats({
          flats: { owned: ownedFlats.length },
          bills: { total: totalBills, overdue: overdueBills, totalAmount, pendingAmount },
          leases: { active: ownedLeases.length },
          issues: { 
            total: issuesPagination.total || issuesList.length,
            open: issuesList.filter(issue => issue.status === 'OPEN').length
          },
          visitors: { pending: visitorsData.count || 0 }
        });

        // Fetch recent activity with defensive handling
        try {
          const [recentBills, recentIssues] = await Promise.all([
            apiService.bills.getAll({ userId: user.id, limit: 3 }),
            apiService.issues.getAll({ reporterId: user.id, limit: 3 })
          ]);

          const recentBillsList = recentBills.data?.data?.bills || [];
          const recentIssuesList = recentIssues.data?.data?.issues || [];

          const activity = [
            ...recentBillsList.map(bill => ({
              type: 'bill',
              title: `${bill.billType || 'Bill'}`,
              description: `₹${bill.amount || 0} - ${bill.status || 'Unknown'}`,
              time: new Date(bill.createdAt).toLocaleDateString(),
              status: bill.status
            })),
            ...recentIssuesList.map(issue => ({
              type: 'issue',
              title: `Issue: ${issue.title || 'Untitled'}`,
              description: `Status: ${issue.status || 'Unknown'}`,
              time: new Date(issue.createdAt).toLocaleDateString(),
              status: issue.status
            }))
          ].sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 5);

          setRecentActivity(activity);
        } catch (activityError) {
          console.warn('Error fetching recent activity:', activityError);
          setRecentActivity([]);
        }

      } catch (error) {
        console.error('Error fetching stats:', error);
        showError('Failed to load dashboard data. Please refresh the page.');
        
        // Set default stats in case of error
        setStats({
          flats: { owned: 0 },
          bills: { total: 0, overdue: 0, totalAmount: 0, pendingAmount: 0 },
          leases: { active: 0 },
          issues: { total: 0, open: 0 },
          visitors: { pending: 0 }
        });
        setRecentActivity([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user.id]);

  const StatCard = ({ title, value, subtitle, icon, color = 'blue', link }) => (
    <div className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow">
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
        {link && (
          <div className="mt-3">
            <Link 
              to={link} 
              className={`text-sm font-medium text-${color}-600 hover:text-${color}-500`}
            >
              View all →
            </Link>
          </div>
        )}
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
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Owner Dashboard</h1>
        <p className="mt-1 text-sm text-gray-600">
          Manage your properties and view tenant information
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatCard
          title="Owned Flats"
          value={stats.flats.owned}
          icon={
            <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          }
          color="blue"
        />
        
        <StatCard
          title="Active Leases"
          value={stats.leases.active}
          subtitle="Current tenants"
          icon={
            <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          }
          color="green"
        />
        
        <StatCard
          title="Total Bills"
          value={stats.bills.total}
          subtitle={`₹${stats.bills.totalAmount.toLocaleString()} total`}
          link="/dashboard/bills"
          icon={
            <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          color="yellow"
        />
        
        <StatCard
          title="Overdue Bills"
          value={stats.bills.overdue}
          subtitle={`₹${stats.bills.pendingAmount.toLocaleString()} pending`}
          link="/dashboard/bills?status=overdue"
          icon={
            <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          }
          color="red"
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 mb-8">
        <StatCard
          title="My Issues"
          value={stats.issues.total}
          subtitle={`${stats.issues.open} open issues`}
          link="/dashboard/issues"
          icon={
            <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          color="orange"
        />

        <StatCard
          title="Pending Visitors"
          value={stats.visitors.pending}
          subtitle="Awaiting approval"
          link="/dashboard/visitors"
          icon={
            <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          }
          color="purple"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Quick Actions */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Quick Actions
            </h3>
            <div className="grid grid-cols-1 gap-3">
              <Link 
                to="/dashboard/issues/new"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                Report Issue
              </Link>
              
              <Link 
                to="/dashboard/visitors/new"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Request Visitor
              </Link>
              
              <Link 
                to="/dashboard/bills"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
              >
                <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                View Bills
              </Link>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Recent Activity
            </h3>
            <div className="space-y-3">
              {recentActivity.length > 0 ? (
                recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className={`flex-shrink-0 w-2 h-2 rounded-full ${
                      activity.type === 'bill' ? 'bg-yellow-400' : 'bg-red-400'
                    }`}></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {activity.title}
                      </p>
                      <p className="text-sm text-gray-500 truncate">
                        {activity.description}
                      </p>
                    </div>
                    <div className="flex-shrink-0 text-sm text-gray-500">
                      {activity.time}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">No recent activity</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboard;