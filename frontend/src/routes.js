// src/routes.js
import { USER_ROLES } from './utils/constants';

/**
 * Route configuration for the Store Rating Platform
 */

// Public routes (accessible without authentication)
export const PUBLIC_ROUTES = {
  LOGIN: '/login',
  SIGNUP: '/signup',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password/:token'
};

// Protected routes (require authentication)
export const PROTECTED_ROUTES = {
  // Admin routes
  ADMIN: {
    DASHBOARD: '/admin',
    USERS: '/admin/users',
    STORES: '/admin/stores',
    ANALYTICS: '/admin/analytics',
    SETTINGS: '/admin/settings'
  },
  
  // User routes
  USER: {
    DASHBOARD: '/dashboard',
    PROFILE: '/profile',
    MY_RATINGS: '/my-ratings',
    SETTINGS: '/settings'
  },
  
  // Store Owner routes
  STORE_OWNER: {
    DASHBOARD: '/store-dashboard',
    STORE_PROFILE: '/store-profile',
    RATINGS: '/store-ratings',
    ANALYTICS: '/store-analytics',
    SETTINGS: '/store-settings'
  }
};

// Route permissions mapping
export const ROUTE_PERMISSIONS = {
  // Admin only routes
  [PROTECTED_ROUTES.ADMIN.DASHBOARD]: [USER_ROLES.ADMIN],
  [PROTECTED_ROUTES.ADMIN.USERS]: [USER_ROLES.ADMIN],
  [PROTECTED_ROUTES.ADMIN.STORES]: [USER_ROLES.ADMIN],
  [PROTECTED_ROUTES.ADMIN.ANALYTICS]: [USER_ROLES.ADMIN],
  [PROTECTED_ROUTES.ADMIN.SETTINGS]: [USER_ROLES.ADMIN],
  
  // User only routes
  [PROTECTED_ROUTES.USER.DASHBOARD]: [USER_ROLES.USER],
  [PROTECTED_ROUTES.USER.PROFILE]: [USER_ROLES.USER],
  [PROTECTED_ROUTES.USER.MY_RATINGS]: [USER_ROLES.USER],
  [PROTECTED_ROUTES.USER.SETTINGS]: [USER_ROLES.USER],
  
  // Store Owner only routes
  [PROTECTED_ROUTES.STORE_OWNER.DASHBOARD]: [USER_ROLES.STORE_OWNER],
  [PROTECTED_ROUTES.STORE_OWNER.STORE_PROFILE]: [USER_ROLES.STORE_OWNER],
  [PROTECTED_ROUTES.STORE_OWNER.RATINGS]: [USER_ROLES.STORE_OWNER],
  [PROTECTED_ROUTES.STORE_OWNER.ANALYTICS]: [USER_ROLES.STORE_OWNER],
  [PROTECTED_ROUTES.STORE_OWNER.SETTINGS]: [USER_ROLES.STORE_OWNER]
};

// Navigation menu items for each role
export const NAVIGATION_MENU = {
  [USER_ROLES.ADMIN]: [
    {
      label: 'Dashboard',
      path: PROTECTED_ROUTES.ADMIN.DASHBOARD,
      icon: 'LayoutDashboard',
      description: 'Overview and statistics'
    },
    {
      label: 'Users',
      path: PROTECTED_ROUTES.ADMIN.USERS,
      icon: 'Users',
      description: 'Manage platform users'
    },
    {
      label: 'Stores',
      path: PROTECTED_ROUTES.ADMIN.STORES,
      icon: 'Store',
      description: 'Manage stores'
    },
    {
      label: 'Analytics',
      path: PROTECTED_ROUTES.ADMIN.ANALYTICS,
      icon: 'BarChart3',
      description: 'Platform analytics'
    },
    {
      label: 'Settings',
      path: PROTECTED_ROUTES.ADMIN.SETTINGS,
      icon: 'Settings',
      description: 'System settings'
    }
  ],
  
  [USER_ROLES.USER]: [
    {
      label: 'Explore Stores',
      path: PROTECTED_ROUTES.USER.DASHBOARD,
      icon: 'Search',
      description: 'Find and rate stores'
    },
    {
      label: 'My Ratings',
      path: PROTECTED_ROUTES.USER.MY_RATINGS,
      icon: 'Star',
      description: 'Your reviews and ratings'
    },
    {
      label: 'Profile',
      path: PROTECTED_ROUTES.USER.PROFILE,
      icon: 'User',
      description: 'Your profile information'
    },
    {
      label: 'Settings',
      path: PROTECTED_ROUTES.USER.SETTINGS,
      icon: 'Settings',
      description: 'Account settings'
    }
  ],
  
  [USER_ROLES.STORE_OWNER]: [
    {
      label: 'Dashboard',
      path: PROTECTED_ROUTES.STORE_OWNER.DASHBOARD,
      icon: 'LayoutDashboard',
      description: 'Store overview'
    },
    {
      label: 'Store Profile',
      path: PROTECTED_ROUTES.STORE_OWNER.STORE_PROFILE,
      icon: 'Store',
      description: 'Manage store information'
    },
    {
      label: 'Reviews',
      path: PROTECTED_ROUTES.STORE_OWNER.RATINGS,
      icon: 'MessageSquare',
      description: 'Customer reviews'
    },
    {
      label: 'Analytics',
      path: PROTECTED_ROUTES.STORE_OWNER.ANALYTICS,
      icon: 'TrendingUp',
      description: 'Store analytics'
    },
    {
      label: 'Settings',
      path: PROTECTED_ROUTES.STORE_OWNER.SETTINGS,
      icon: 'Settings',
      description: 'Store settings'
    }
  ]
};

/**
 * Get the default dashboard route for a user role
 * @param {string} role - User role
 * @returns {string} Default route for the role
 */
export const getDefaultRoute = (role) => {
  switch (role) {
    case USER_ROLES.ADMIN:
      return PROTECTED_ROUTES.ADMIN.DASHBOARD;
    case USER_ROLES.STORE_OWNER:
      return PROTECTED_ROUTES.STORE_OWNER.DASHBOARD;
    case USER_ROLES.USER:
    default:
      return PROTECTED_ROUTES.USER.DASHBOARD;
  }
};

/**
 * Check if a user has access to a specific route
 * @param {string} route - Route path
 * @param {string} userRole - User role
 * @returns {boolean} Whether user has access
 */
export const hasRouteAccess = (route, userRole) => {
  const allowedRoles = ROUTE_PERMISSIONS[route];
  return allowedRoles ? allowedRoles.includes(userRole) : false;
};

/**
 * Get navigation menu for a specific role
 * @param {string} role - User role
 * @returns {Array} Navigation menu items
 */
export const getNavigationMenu = (role) => {
  return NAVIGATION_MENU[role] || [];
};

/**
 * Route metadata for SEO and page titles
 */
export const ROUTE_META = {
  [PUBLIC_ROUTES.LOGIN]: {
    title: 'Login - Store Rating Platform',
    description: 'Sign in to your account'
  },
  [PUBLIC_ROUTES.SIGNUP]: {
    title: 'Sign Up - Store Rating Platform',
    description: 'Create a new account'
  },
  [PROTECTED_ROUTES.ADMIN.DASHBOARD]: {
    title: 'Admin Dashboard - Store Rating Platform',
    description: 'Platform administration and analytics'
  },
  [PROTECTED_ROUTES.USER.DASHBOARD]: {
    title: 'Explore Stores - Store Rating Platform',
    description: 'Discover and rate your favorite stores'
  },
  [PROTECTED_ROUTES.STORE_OWNER.DASHBOARD]: {
    title: 'Store Dashboard - Store Rating Platform',
    description: 'Manage your store and view customer feedback'
  }
};

/**
 * Breadcrumb configuration
 */
export const BREADCRUMBS = {
  [PROTECTED_ROUTES.ADMIN.DASHBOARD]: [
    { label: 'Home', path: '/' },
    { label: 'Admin Dashboard', path: PROTECTED_ROUTES.ADMIN.DASHBOARD }
  ],
  [PROTECTED_ROUTES.ADMIN.USERS]: [
    { label: 'Home', path: '/' },
    { label: 'Admin Dashboard', path: PROTECTED_ROUTES.ADMIN.DASHBOARD },
    { label: 'Users', path: PROTECTED_ROUTES.ADMIN.USERS }
  ],
  [PROTECTED_ROUTES.USER.DASHBOARD]: [
    { label: 'Home', path: '/' },
    { label: 'Explore Stores', path: PROTECTED_ROUTES.USER.DASHBOARD }
  ],
  [PROTECTED_ROUTES.STORE_OWNER.DASHBOARD]: [
    { label: 'Home', path: '/' },
    { label: 'Store Dashboard', path: PROTECTED_ROUTES.STORE_OWNER.DASHBOARD }
  ]
};

/**
 * External links
 */
export const EXTERNAL_LINKS = {
  PRIVACY_POLICY: '/privacy-policy',
  TERMS_OF_SERVICE: '/terms-of-service',
  CONTACT_SUPPORT: '/contact-support',
  HELP_CENTER: '/help',
  API_DOCS: '/api-docs'
};

// Default export with all route utilities
export default {
  PUBLIC_ROUTES,
  PROTECTED_ROUTES,
  ROUTE_PERMISSIONS,
  NAVIGATION_MENU,
  ROUTE_META,
  BREADCRUMBS,
  EXTERNAL_LINKS,
  getDefaultRoute,
  hasRouteAccess,
  getNavigationMenu
};


