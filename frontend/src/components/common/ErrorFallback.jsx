import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

const ErrorFallback = ({ error, resetErrorBoundary }) => {
  const isDevelopment = process.env.NODE_ENV === 'development';

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-lg w-full">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center animate-fade-in">
          {/* Error Icon */}
          <div className="w-20 h-20 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-10 h-10 text-red-500" />
          </div>

          {/* Error Title */}
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Oops! Something went wrong
          </h1>

          {/* Error Description */}
          <p className="text-gray-600 mb-8 leading-relaxed">
            We encountered an unexpected error. Don't worry, our team has been notified. 
            Please try refreshing the page or go back to the homepage.
          </p>

          {/* Action Buttons */}
          <div className="space-y-3 mb-6">
            <button
              onClick={resetErrorBoundary}
              className="w-full btn-primary flex items-center justify-center space-x-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Try Again</span>
            </button>

            <button
              onClick={() => window.location.href = '/'}
              className="w-full btn-secondary flex items-center justify-center space-x-2"
            >
              <Home className="w-4 h-4" />
              <span>Go to Homepage</span>
            </button>

            <button
              onClick={() => window.location.reload()}
              className="w-full text-sm text-gray-500 hover:text-gray-700 transition-colors py-2"
            >
              Refresh Page
            </button>
          </div>

          {/* Development Error Details */}
          {isDevelopment && error && (
            <details className="text-left bg-gray-50 rounded-lg p-4 mt-6">
              <summary className="cursor-pointer text-sm font-medium text-gray-700 mb-3">
                🐛 Error Details (Development Only)
              </summary>
              
              <div className="space-y-3">
                <div>
                  <h4 className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    Error Message:
                  </h4>
                  <p className="text-sm text-red-600 font-mono bg-red-50 p-2 rounded border">
                    {error.message}
                  </p>
                </div>

                {error.stack && (
                  <div>
                    <h4 className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                      Stack Trace:
                    </h4>
                    <pre className="text-xs text-gray-700 bg-white p-3 rounded border overflow-auto max-h-40 font-mono">
                      {error.stack}
                    </pre>
                  </div>
                )}
              </div>
            </details>
          )}

          {/* Help Text */}
          <p className="text-xs text-gray-400 mt-6">
            Error ID: {Date.now()} • Store Rating Platform
          </p>
        </div>
      </div>
    </div>
  );
};

export default ErrorFallback;