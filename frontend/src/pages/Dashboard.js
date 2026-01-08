import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import DashboardLayout from '../components/DashboardLayout';
import OwnerDashboard from '../components/dashboards/OwnerDashboard';
import TenantDashboard from '../components/dashboards/TenantDashboard';
import SecretaryDashboard from '../components/dashboards/SecretaryDashboard';
import StaffDashboard from '../components/dashboards/StaffDashboard';
import GuardDashboard from '../components/dashboards/GuardDashboard';

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
        <Route path="/profile" element={<div>Profile Page (Coming Soon)</div>} />
        <Route path="/settings" element={<div>Settings Page (Coming Soon)</div>} />
      </Routes>
    </DashboardLayout>
  );
};

export default Dashboard;