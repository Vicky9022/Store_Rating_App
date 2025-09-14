import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'react-hot-toast';
import { ErrorBoundary } from 'react-error-boundary';

// Import styles
import './styles/index.css';
import './App.css';

// Import components
import App from './App';
import { AuthProvider } from './context/AuthContext';
import ErrorFallback from './components/common/ErrorFallback';
import LoadingSpinner from './components/common/LoadingSpinner';

// Service worker registration (optional)
// import { registerServiceWorker } from './utils/serviceWorker';

/**
 * Configure React Query client with optimized settings
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Retry failed requests
      retry: (failureCount, error) => {
        // Don't retry on 4xx errors (client errors)
        if (error?.response?.status >= 400 && error?.response?.status < 500) {
          return false;
        }
        // Retry up to 3 times for other errors
        return failureCount < 3;
      },
      
      // Cache data for 5 minutes
      staleTime: 5 * 60 * 1000,
      
      // Keep data in cache for 10 minutes
      cacheTime: 10 * 60 * 1000,
      
      // Don't refetch on window focus in development
      refetchOnWindowFocus: process.env.NODE_ENV === 'production',
      
      // Don't refetch on reconnect by default
      refetchOnReconnect: 'always',
      
      // Show loading states for queries taking longer than 1 second
      suspense: false,
      
      // Error boundary will catch query errors
      useErrorBoundary: (error) => {
        // Use error boundary for 5xx server errors
        return error?.response?.status >= 500;
      }
    },
    
    mutations: {
      // Retry mutations once on failure
      retry: 1,
      
      // Use error boundary for mutation errors
      useErrorBoundary: false,
      
      // Show success notifications for mutations
      onSuccess: () => {
        // This can be overridden in individual mutations
      },
      
      // Handle mutation errors globally
      onError: (error) => {
        console.error('Mutation error:', error);
        // Individual mutations can override this
      }
    }
  }
});

/**
 * Global error boundary fallback component
 */
const GlobalErrorFallback = ({ error, resetErrorBoundary }) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
    <div className="max-w-md w-full text-center">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="text-red-500 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Something went wrong</h1>
        
        <p className="text-gray-600 mb-6">
          We're sorry, but something unexpected happened. Please try refreshing the page.
        </p>
        
        <div className="space-y-3">
          <button
            onClick={resetErrorBoundary}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Try Again
          </button>
          
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors font-medium"
          >
            Refresh Page
          </button>
        </div>
        
        {process.env.NODE_ENV === 'development' && (
          <details className="mt-6 text-left">
            <summary className="cursor-pointer text-sm text-gray-500 mb-2">
              Error Details (Development)
            </summary>
            <pre className="text-xs text-red-600 bg-red-50 p-3 rounded border overflow-auto max-h-40">
              {error.message}
              {error.stack}
            </pre>
          </details>
        )}
      </div>
    </div>
  </div>
);

/**
 * Loading fallback for Suspense boundaries
 */
const SuspenseFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <LoadingSpinner size="lg" />
      <p className="mt-4 text-gray-600">Loading Store Rating Platform...</p>
    </div>
  </div>
);

/**
 * Toast configuration
 */
const toastOptions = {
  // Global toast options
  duration: 4000,
  position: 'top-right',
  
  // Styling
  style: {
    background: '#fff',
    color: '#374151',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    border: '1px solid #e5e7eb',
    borderRadius: '0.5rem',
    padding: '12px 16px'
  },
  
  // Success toast styling
  success: {
    duration: 3000,
    iconTheme: {
      primary: '#10b981',
      secondary: '#fff',
    },
  },
  
  // Error toast styling
  error: {
    duration: 5000,
    iconTheme: {
      primary: '#ef4444',
      secondary: '#fff',
    },
  },
  
  // Loading toast styling
  loading: {
    iconTheme: {
      primary: '#3b82f6',
      secondary: '#fff',
    },
  }
};

/**
 * Application root component with all providers
 */
const AppRoot = () => {
  return (
    <React.StrictMode>
      <ErrorBoundary
        FallbackComponent={GlobalErrorFallback}
        onError={(error, errorInfo) => {
          // Log error to console in development
          if (process.env.NODE_ENV === 'development') {
            console.error('Global Error Boundary caught an error:', error, errorInfo);
          }
          
          // In production, you might want to send this to an error reporting service
          // Example: Sentry.captureException(error, { extra: errorInfo });
        }}
        onReset={() => {
          // Clear any stale state when resetting
          queryClient.clear();
          window.location.href = '/';
        }}
      >
        <BrowserRouter>
          <QueryClientProvider client={queryClient}>
            <AuthProvider>
              <React.Suspense fallback={<SuspenseFallback />}>
                <App />
              </React.Suspense>
              
              {/* Toast notifications */}
              <Toaster
                toastOptions={toastOptions}
                containerClassName="z-50"
                reverseOrder={false}
              />
              
              {/* React Query Devtools - Only in development */}
              {process.env.NODE_ENV === 'development' && (
                <ReactQueryDevtools initialIsOpen={false} />
              )}
            </AuthProvider>
          </QueryClientProvider>
        </BrowserRouter>
      </ErrorBoundary>
    </React.StrictMode>
  );
};

// Get root element
const container = document.getElementById('root');

// Ensure root element exists
if (!container) {
  throw new Error('Root element not found. Make sure you have a div with id="root" in your index.html');
}

// Create root and render app
const root = ReactDOM.createRoot(container);
root.render(<AppRoot />);

// Performance monitoring (optional)
if (process.env.NODE_ENV === 'production') {
  // Report web vitals
  import('./utils/reportWebVitals').then(({ default: reportWebVitals }) => {
    reportWebVitals(console.log);
  }).catch(() => {
    // Ignore if reportWebVitals doesn't exist
  });
}

// Service worker registration (optional)
// Uncomment the following lines if you want to enable service worker for PWA features
/*
if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('SW registered: ', registration);
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}
*/

// Hot module replacement (development only)
if (process.env.NODE_ENV === 'development' && module.hot) {
  module.hot.accept('./App', () => {
    // Re-render the app when App.js changes
    const NextApp = require('./App').default;
    root.render(<AppRoot />);
  });
}

// Global error handling for uncaught errors
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
  // In production, send to error reporting service
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
  // In production, send to error reporting service
});

// Prevent right-click in production (optional security measure)
if (process.env.NODE_ENV === 'production') {
  document.addEventListener('contextmenu', (e) => {
    // e.preventDefault(); // Uncomment to disable right-click
  });
}