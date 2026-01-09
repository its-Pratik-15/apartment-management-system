import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import DashboardLayout from '../components/DashboardLayout';
import OwnerDashboard from '../components/dashboards/OwnerDashboard';
import TenantDashboard from '../components/dashboards/TenantDashboard';
import SecretaryDashboard from '../components/dashboards/SecretaryDashboard';
import StaffDashboard from '../components/dashboards/StaffDashboard';
import GuardDashboard from '../components/dashboards/GuardDashboard';
import Users from './Users';
import Bills from './Bills';
import Flats from './Flats';
import Leases from './Leases';
import Notices from './Notices';
import Issues from './Issues';
import Visitors from './Visitors';
import NewFlat from './NewFlat';
import NewNotice from './NewNotice';
import NewIssue from './NewIssue';
import NewVisitor from './NewVisitor';

const Dashboard = () => {
  const { user } = useAuth();

  // Role-based dashboard routing
  const getDashboardComponent = () => {
    switch (user?.role) {
      case 'SECRETARY':
        return <SecretaryDashboard />;
      case 'OWNER':
        return <OwnerDashboard />;
      case 'TENANT':
        return <TenantDashboard />;
      case 'STAFF':
        return <StaffDashboard />;
      case 'GUARD':
        return <GuardDashboard />;
      default:
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Welcome to Apartment Management System
            </h2>
            <p className="text-gray-600">
              Your role: {user?.role || 'Unknown'}
            </p>
          </div>
        );
    }
  };

  return (
    <DashboardLayout>
      <Routes>
        <Route path="/" element={getDashboardComponent()} />
        
        {/* Secretary-only routes */}
        {user?.role === 'SECRETARY' && (
          <>
            <Route path="/users" element={<Users />} />
            <Route path="/flats" element={<Flats />} />
            <Route path="/flats/new" element={<NewFlat />} />
            <Route path="/leases" element={<Leases />} />
            <Route path="/notices" element={<Notices />} />
            <Route path="/notices/new" element={<NewNotice />} />
            <Route path="/reports" element={<div>Reports (Coming Soon)</div>} />
          </>
        )}
        
        {/* Bills - accessible by all roles */}
        <Route path="/bills" element={<Bills />} />
        
        {/* Issues - accessible by owners and tenants */}
        {(user?.role === 'OWNER' || user?.role === 'TENANT' || user?.role === 'SECRETARY' || user?.role === 'STAFF') && (
          <>
            <Route path="/issues" element={<Issues />} />
            <Route path="/issues/new" element={<NewIssue />} />
          </>
        )}
        
        {/* Visitors - accessible by owners, tenants, and guards */}
        {(user?.role === 'OWNER' || user?.role === 'TENANT' || user?.role === 'GUARD' || user?.role === 'SECRETARY') && (
          <>
            <Route path="/visitors" element={<Visitors />} />
            <Route path="/visitors/new" element={<NewVisitor />} />
          </>
        )}
        
        {/* Common routes */}
        <Route path="/profile" element={<div>Profile Page (Coming Soon)</div>} />
        <Route path="/settings" element={<div>Settings Page (Coming Soon)</div>} />
        
        {/* Catch all */}
        <Route path="*" element={<div>Page not found</div>} />
      </Routes>
    </DashboardLayout>
  );
};

export default Dashboard;