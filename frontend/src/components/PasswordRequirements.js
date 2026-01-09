import React, { useState, useEffect } from 'react';

const PasswordRequirements = ({ password, showRequirements = true }) => {
  const [requirements, setRequirements] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false
  });

  useEffect(() => {
    if (password) {
      setRequirements({
        length: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        number: /\d/.test(password),
        special: /[@$!%*?&#]/.test(password)
      });
    } else {
      setRequirements({
        length: false,
        uppercase: false,
        lowercase: false,
        number: false,
        special: false
      });
    }
  }, [password]);

  const allRequirementsMet = Object.values(requirements).every(req => req);

  if (!showRequirements) {
    return null;
  }

  const RequirementItem = ({ met, text }) => (
    <div className={`flex items-center text-xs ${met ? 'text-green-600' : 'text-gray-500'}`}>
      <svg 
        className={`w-3 h-3 mr-1 ${met ? 'text-green-500' : 'text-gray-400'}`} 
        fill="currentColor" 
        viewBox="0 0 20 20"
      >
        {met ? (
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        ) : (
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        )}
      </svg>
      {text}
    </div>
  );

  return (
    <div className="mt-2 p-3 bg-gray-50 rounded-md border">
      <div className="text-xs font-medium text-gray-700 mb-2">
        Password Requirements:
      </div>
      <div className="space-y-1">
        <RequirementItem 
          met={requirements.length} 
          text="At least 8 characters long" 
        />
        <RequirementItem 
          met={requirements.uppercase} 
          text="One uppercase letter (A-Z)" 
        />
        <RequirementItem 
          met={requirements.lowercase} 
          text="One lowercase letter (a-z)" 
        />
        <RequirementItem 
          met={requirements.number} 
          text="One number (0-9)" 
        />
        <RequirementItem 
          met={requirements.special} 
          text="One special character (@$!%*?&#)" 
        />
      </div>
      {password && (
        <div className={`mt-2 text-xs font-medium ${allRequirementsMet ? 'text-green-600' : 'text-red-600'}`}>
          {allRequirementsMet ? '✓ Password meets all requirements' : '✗ Password does not meet all requirements'}
        </div>
      )}
    </div>
  );
};

// Utility function to validate password
export const validatePassword = (password) => {
  const requirements = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /\d/.test(password),
    special: /[@$!%*?&#]/.test(password)
  };

  const isValid = Object.values(requirements).every(req => req);
  
  return {
    isValid,
    requirements,
    message: isValid 
      ? 'Password meets all requirements' 
      : 'Password must contain at least 8 characters, including uppercase, lowercase, number, and special character'
  };
};

export default PasswordRequirements;