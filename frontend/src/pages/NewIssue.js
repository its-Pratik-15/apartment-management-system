import React from 'react';
import IssueForm from '../components/forms/IssueForm';

const NewIssue = () => {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Report New Issue</h1>
        <p className="mt-1 text-sm text-gray-600">
          Report a maintenance or other issue in the apartment complex
        </p>
      </div>
      <IssueForm />
    </div>
  );
};

export default NewIssue;