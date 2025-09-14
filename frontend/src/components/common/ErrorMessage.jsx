import React from 'react';
import { AlertCircle } from 'lucide-react';

const ErrorMessage = ({ message, className = "" }) => {
  if (!message) return null;
  
  return (
    <div className={`flex items-center space-x-2 text-red-600 text-sm ${className}`}>
      <AlertCircle className="h-4 w-4 flex-shrink-0" />
      <span>{message}</span>
    </div>
  );
};

export default ErrorMessage;