import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiService } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

const TenantDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    bills: { total: 0, overdue: 0, totalAmount: 0, pendingAmount: 0 },
    visitors: { pending: 0, approved: 0, rejected: 0 },
    issues: { total: 0, open: 0 },
    lease: { monthlyRent: 0, endDate: null, daysRemaining: 0 },
    notices: { total: 0, pinned: 0 }
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [billsRes, visitorsRes, issuesRes, leasesRes, noticesRes] = await Promise.all([
          apiService.bills.getAll({ userId: user.id, limit: 100 }),
          apiService.visitors.getAll({ limit: 100 }),
          apiService.issues.getAll({ reporterId: user.id, limit: 100 }),
          apiService.leases.getAll({ tenantId: user.id, isActive: true }),
          apiService.notices.getAll({ limit: 100 })
        ]);

        // Calculate bill statistics
        const bills = billsRes.data.data.bills;
        const totalBills = bills.length;
        const overdueBills = bills.filter(bill => bill.status === 'OVERDUE').length;
        const totalAmount = bills.reduce((sum, bill) => sum + bill.amount, 0);
        const pendingAmount = bills
          .filter(bill => bill.status !== 'PAID')
          .reduce((sum, bill) => sum + bill.amount, 0);

        // Calculate visitor statistics
        const visitors = visitorsRes.data.data.visitorLogs;
        const pendingVisitors = visitors.filter(v => v.isApproved === null).length;
        const approvedVisitors = visitors.filter(v => v.isApproved === true).length;
        const rejectedVisitors = visitors.filter(v => v.isApproved === false).length;

        // Calculate issue statistics
        const issues = issuesRes.data.data.issues;
        const totalIssues = issues.length;
        const openIssues = issues.filter(issue => issue.status === 'OPEN').length;

        // Calculate lease information
        const leases = leasesRes.data.data.leases;
        let leaseInfo = { monthlyRent: 0, endDate: null, daysRemaining: 0 };
        if (leases.length > 0) {
          const activeLease = leases[0];
          const endDate = new Date(activeLease.endDate);
          const today = new Date();
          const daysRemaining = Math.ceil((endDate - today) / (1000 * 60 * 60 * 24));
          
          leaseInfo = {
            monthlyRent: activeLease.monthlyRent,
            endDate: activeLease.endDate,
            daysRemaining: Math.max(0, daysRemaining)
          };
        }

        // Calculate notice statistics
        const notices = noticesRes.data.data.notices;
        const tenantNotices = notices.filter(notice => 
          notice.targetRoles.includes('TENANT') && notice.isActive
        );
        const pinnedNotices = tenantNotices.filter(notice => notice.isPinned).length;

        setStats({
          bills: { total: totalBills, overdue: overdueBills, totalAmount, pendingAmount },
          visitors: { pending: pendingVisitors, approved: approvedVisitors, rejected: rejectedVisitors },
          issues: { total: totalIssues, open: openIssues },
          lease: leaseInfo,
          notices: { total: tenantNotices.length, pinned: pinnedNotices }
        });

        // Fetch recent activity
        const [recentBills, recentIssues, recentVisitors] = await Promise.all([
          apiService.bills.getAll({ userId: user.id, limit: 3 }),
          apiService.issues.getAll({ reporterId: user.id, limit: 3 }),
          apiService.visitors.getAll({ limit: 3 })
        ]);

        const activity = [
          ...recentBills.data.data.bills.map(bill => ({
            type: 'bill',
            title: `${bill.billType} bill`,
            description: `₹${bill.amount} - ${bill.status}`,
            time: new Date(bill.createdAt).toLocaleDateString(),
            status: bill.status
          })),
          ...recentIssues.data.data.issues.map(issue => ({
            type: 'issue',
            title: `Issue: ${issue.title}`,
            description: `Status: ${issue.status}`,
            time: new Date(issue.createdAt).toLocaleDateString(),
            status: issue.status
          })),
          ...recentVisitors.data.data.visitorLogs.slice(0, 2).map(visitor => ({
            type: 'visitor',
            title: `Visitor: ${visitor.visitorName}`,
            description: `Status: ${visitor.isApproved === null ? 'Pending' : visitor.isApproved ? 'Approved' : 'Rejected'}`,
            time: new Date(visitor.createdAt).toLocaleDateString(),
            status: visitor.isApproved === null ? 'PENDING' : visitor.isApproved ? 'APPROVED' : 'REJECTED'
          }))
        ].sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 5);

        setRecentActivity(activity);
      } catch (error) {
        console.error('Error fetching tenant stats:', error);
        // Set default stats in case of error
        setStats({
          bills: { total: 0, overdue: 0, totalAmount: 0, pendingAmount: 0 },
          visitors: { pending: 0, approved: 0, rejected: 0 },
          issues: { total: 0, open: 0 },
          lease: { monthlyRent: 0, endDate: null, daysRemaining: 0 },
          notices: { total: 0, pinned: 0 }
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
        <h1 className="text-2xl font-bold text-gray-900">Tenant Dashboard</h1>
        <p className="mt-1 text-sm text-gray-600">
          View your bills, manage visitors, and stay updated
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatCard
          title="My Bills"
          value={stats.bills.total}
          subtitle={`₹${stats.bills.totalAmount.toLocaleString()} total`}
          link="/dashboard/bills"
          icon={
            <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          color="blue"
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
        
        <StatCard
          title="Pending Visitors"
          value={stats.visitors.pending}
          subtitle={`${stats.visitors.approved} approved`}
          link="/dashboard/visitors"
          icon={
            <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          }
          color="purple"
        />
        
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
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-8">
        <StatCard
          title="Monthly Rent"
          value={`₹${stats.lease.monthlyRent.toLocaleString()}`}
          subtitle={stats.lease.daysRemaining > 0 ? `${stats.lease.daysRemaining} days remaining` : 'Lease expired'}
          icon={
            <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          }
          color="green"
        />

        <StatCard
          title="Notices"
          value={stats.notices.total}
          subtitle={`${stats.notices.pinned} pinned`}
          link="/dashboard/notices"
          icon={
            <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
            </svg>
          }
          color="indigo"
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
                to="/dashboard/bills"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Pay Bills
              </Link>
              
              <Link 
                to="/dashboard/issues/new"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
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
                      activity.type === 'bill' ? 'bg-blue-400' : 
                      activity.type === 'issue' ? 'bg-orange-400' : 'bg-purple-400'
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

export default TenantDashboard;