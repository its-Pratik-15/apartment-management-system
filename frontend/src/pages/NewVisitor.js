import React from 'react';
import VisitorForm from '../components/forms/VisitorForm';
import { useAuth } from '../contexts/AuthContext';

const NewVisitor = () => {
  const { user } = useAuth();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {user.role === 'GUARD' ? 'Register New Visitor' : 'Request Visitor Entry'}
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          {user.role === 'GUARD' 
            ? 'Register a visitor entry at the gate' 
            : 'Request approval for a visitor to your flat'
          }
        </p>
      </div>
      <VisitorForm />
    </div>
  );
};

export default NewVisitor;