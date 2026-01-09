import React from 'react';
import NoticeForm from '../components/forms/NoticeForm';

const NewNotice = () => {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Create New Notice</h1>
        <p className="mt-1 text-sm text-gray-600">
          Post a new notice for residents
        </p>
      </div>
      <NoticeForm />
    </div>
  );
};

export default NewNotice;