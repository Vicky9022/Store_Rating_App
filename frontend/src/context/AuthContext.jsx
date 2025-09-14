import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { authService } from '../services/authService';
import { getDefaultRoute } from '../routes';
import { USER_ROLES } from '../utils/constants';
import toast from 'react-hot-toast';

// Create the context
const AuthContext = createContext(null);

/**
 * Custom hook to use the auth context
 * @returns {Object} Auth context value
 * @throws {Error} If used outside of AuthProvider
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

/**
 * Authentication Provider Component
 * Manages user authentication state and provides auth methods
 */
export const AuthProvider = ({ children }) => {
  // State
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Initialize authentication state on app load
   */
  const initializeAuth = useCallback(() => {
    try {
      setLoading(true);
      const currentUser = authService.getCurrentUser();
      
      if (currentUser) {
        // Validate user object structure
        if (currentUser.id && currentUser.email && currentUser.role) {
          setUser(currentUser);
        } else {
          // Invalid user data, clear storage
          authService.logout();
          setUser(null);
        }
      }
    } catch (error) {
      console.error('Error initializing auth:', error);
      authService.logout();
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initialize auth on mount
 // Force fresh login on app start
useEffect(() => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}, []);

// Initialize auth on mount
useEffect(() => {
  initializeAuth();
}, [initializeAuth]);


  /**
   * Login function
   * @param {Object} credentials - User login credentials
   * @param {string} credentials.email - User email
   * @param {string} credentials.password - User password
   * @returns {Promise<Object>} Login response data
   * @throws {Error} Login error
   */
  const login = useCallback(async (credentials) => {
    try {
      setLoading(true);
      setError(null);

      // Validate credentials
      if (!credentials.email || !credentials.password) {
        throw new Error('Email and password are required');
      }

      const data = await authService.login(credentials);
      
      // Validate response
      if (!data.user || !data.token) {
        throw new Error('Invalid login response');
      }

      setUser(data.user);
      
      // Success notification
      toast.success(`Welcome back, ${data.user.name}!`);
      
      return data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Login failed';
      setError(errorMessage);
      toast.error(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Register function
   * @param {Object} userData - User registration data
   * @param {string} userData.name - User full name
   * @param {string} userData.email - User email
   * @param {string} userData.password - User password
   * @param {string} userData.role - User role
   * @returns {Promise<Object>} Registration response data
   * @throws {Error} Registration error
   */
  const register = useCallback(async (userData) => {
    try {
      setLoading(true);
      setError(null);

      // Validate required fields
      const requiredFields = ['name', 'email', 'password', 'role'];
      for (const field of requiredFields) {
        if (!userData[field]) {
          throw new Error(`${field} is required`);
        }
      }

      // Validate role
      if (!Object.values(USER_ROLES).includes(userData.role)) {
        throw new Error('Invalid user role');
      }

      const data = await authService.register(userData);
      
      // Validate response
      if (!data.user || !data.token) {
        throw new Error('Invalid registration response');
      }

      setUser(data.user);
      
      // Success notification
      toast.success(`Welcome to Store Rating Platform, ${data.user.name}!`);
      
      return data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Registration failed';
      setError(errorMessage);
      toast.error(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Logout function
   * Clears user state and local storage
   */
  const logout = useCallback(() => {
    try {
      authService.logout();
      setUser(null);
      setError(null);
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
      // Force clear state even if there's an error
      setUser(null);
      setError(null);
    }
  }, []);

  /**
   * Update user profile
   * @param {Object} updates - User profile updates
   * @returns {Promise<Object>} Updated user data
   */
  const updateProfile = useCallback(async (updates) => {
    try {
      setLoading(true);
      setError(null);

      // Update user in backend (you'll need to implement this in userService)
      // const updatedUser = await userService.updateProfile(updates);
      
      // For now, just update local state
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      
      // Update localStorage
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      toast.success('Profile updated successfully');
      return updatedUser;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Profile update failed';
      setError(errorMessage);
      toast.error(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [user]);

  /**
   * Change password function
   * @param {Object} passwordData - Password change data
   * @param {string} passwordData.oldPassword - Current password
   * @param {string} passwordData.newPassword - New password
   * @returns {Promise<void>}
   */
  const changePassword = useCallback(async (passwordData) => {
    try {
      setLoading(true);
      setError(null);

      await authService.changePassword(passwordData);
      toast.success('Password changed successfully');
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Password change failed';
      setError(errorMessage);
      toast.error(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Check if user has a specific role
   * @param {string} role - Role to check
   * @returns {boolean} Whether user has the role
   */
  const hasRole = useCallback((role) => {
    return user?.role === role;
  }, [user]);

  /**
   * Check if user has any of the specified roles
   * @param {string[]} roles - Roles to check
   * @returns {boolean} Whether user has any of the roles
   */
  const hasAnyRole = useCallback((roles) => {
    return user?.role && roles.includes(user.role);
  }, [user]);

  /**
   * Get user's default dashboard route
   * @returns {string} Default route path
   */
  const getDefaultDashboard = useCallback(() => {
    if (!user) return '/login';
    return getDefaultRoute(user.role);
  }, [user]);

  /**
   * Refresh user data from server
   * @returns {Promise<Object>} Updated user data
   */
  const refreshUser = useCallback(async () => {
    try {
      setLoading(true);
      // You'll need to implement this endpoint
      // const userData = await userService.getCurrentUser();
      // setUser(userData);
      // return userData;
      
      // For now, just return current user
      return user;
    } catch (error) {
      console.error('Error refreshing user:', error);
      // If refresh fails, check if token is still valid
      const currentUser = authService.getCurrentUser();
      if (!currentUser) {
        logout();
      }
      throw error;
    } finally {
      setLoading(false);
    }
  }, [user, logout]);

  /**
   * Clear error state
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Context value
  const value = {
    // State
    user,
    loading,
    error,
    isAuthenticated: !!user,
    
    // Auth actions
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    
    // Utility functions
    hasRole,
    hasAnyRole,
    getDefaultDashboard,
    refreshUser,
    clearError,
    
    // User info helpers
    isAdmin: hasRole(USER_ROLES.ADMIN),
    isUser: hasRole(USER_ROLES.USER),
    isStoreOwner: hasRole(USER_ROLES.STORE_OWNER),
    
    // User details
    userName: user?.name || '',
    userEmail: user?.email || '',
    userRole: user?.role || '',
    userId: user?.id || user?._id || ''
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * HOC to wrap components that require authentication
 * @param {React.Component} Component - Component to wrap
 * @returns {React.Component} Wrapped component
 */
export const withAuth = (Component) => {
  return function AuthenticatedComponent(props) {
    const { isAuthenticated, loading } = useAuth();
    
    if (loading) {
      return <div>Loading...</div>;
    }
    
    if (!isAuthenticated) {
      return <div>Please log in to access this content.</div>;
    }
    
    return <Component {...props} />;
  };
};

/**
 * HOC to wrap components that require specific roles
 * @param {React.Component} Component - Component to wrap
 * @param {string[]} allowedRoles - Allowed roles
 * @returns {React.Component} Wrapped component
 */
export const withRoles = (Component, allowedRoles) => {
  return function RoleAuthenticatedComponent(props) {
    const { user, hasAnyRole, loading } = useAuth();
    
    if (loading) {
      return <div>Loading...</div>;
    }
    
    if (!user) {
      return <div>Please log in to access this content.</div>;
    }
    
    if (!hasAnyRole(allowedRoles)) {
      return <div>You don't have permission to access this content.</div>;
    }
    
    return <Component {...props} />;
  };
};

// Default export
export default AuthContext;