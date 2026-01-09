import React from 'react';
import FlatForm from '../components/forms/FlatForm';

const NewFlat = () => {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Add New Flat</h1>
        <p className="mt-1 text-sm text-gray-600">
          Create a new flat in the apartment complex
        </p>
      </div>
      <FlatForm />
    </div>
  );
};

export default NewFlat;