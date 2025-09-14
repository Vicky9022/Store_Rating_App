import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import PrivateRoute from './components/common/PrivateRoute';
import LoginForm from './components/auth/LoginForm';
import SignupForm from './components/auth/SignupForm';
import AdminDashboard from './components/admin/AdminDashboard';
import UserDashboard from './components/user/UserDashboard';
import StoreOwnerDashboard from './components/store-owner/StoreOwnerDashboard';
import LoadingSpinner from './components/common/LoadingSpinner';
import { USER_ROLES } from './utils/constants';

// Import CSS files
import './App.css'; // Custom styles and animations
import './styles/index.css'; // Tailwind CSS

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  const getDashboardRoute = () => {
    if (!user) return '/login';
    switch (user.role) {
      case USER_ROLES.ADMIN:
        return '/admin';
      case USER_ROLES.STORE_OWNER:
        return '/store-dashboard';
      case USER_ROLES.USER:
        return '/dashboard';  
      default:
        return '/login';
    }
  };

  return (
    <div className="App">
      <Routes>
        {/* Public Routes */}
        <Route 
          path="/login" 
          element={!user ? <LoginForm /> : <Navigate to={getDashboardRoute()} replace />} 
        />
        <Route 
          path="/signup" 
          element={!user ? <SignupForm /> : <Navigate to={getDashboardRoute()} replace />} 
        />
        
        {/* Protected Routes */}
        <Route element={<PrivateRoute />}>
          {/* Admin Routes */}
          <Route 
            path="/admin" 
            element={
              user?.role === USER_ROLES.ADMIN ? (
                <AdminDashboard />
              ) : (
                <Navigate to={getDashboardRoute()} replace />
              )
            } 
          />
          
          {/* User Routes */}
          <Route 
            path="/dashboard" 
            element={
              user?.role === USER_ROLES.USER ? (
                <UserDashboard />
              ) : (
                <Navigate to={getDashboardRoute()} replace />
              )
            } 
          />
          
          {/* Store Owner Routes */}
          <Route 
            path="/store-dashboard" 
            element={
              user?.role === USER_ROLES.STORE_OWNER ? (
                <StoreOwnerDashboard />
              ) : (
                <Navigate to={getDashboardRoute()} replace />
              )
            } 
          />
        </Route>
        
        {/* Default Routes */}
        - <Route path="/" element={<Navigate to={getDashboardRoute()} replace />} />
        + <Route path="/" element={<LoginForm />} />
        {/*<Route path="*" element={<Navigate to={getDashboardRoute()} replace />} />*/}
      </Routes>
    </div>
  );
}

export default App;