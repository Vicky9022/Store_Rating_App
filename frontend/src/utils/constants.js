export const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user',
  STORE_OWNER: 'store_owner'
};

// ✅ CORRECTED ROUTES (URL paths, not component names)
export const ROUTES = {
  LOGIN: '/login',              // ❌ Was: '/LoginForm'
  SIGNUP: '/signup',            // ❌ Was: '/SignupForm'  
  ADMIN_DASHBOARD: '/admin',    // ❌ Was: '/AdminDashboard'
  USER_DASHBOARD: '/dashboard', // ❌ Was: '/UsersDashboard'
  STORE_DASHBOARD: '/store-dashboard'  // ❌ Was: '/AdminDashboard'
};

export const VALIDATION_RULES = {
  NAME_MIN: 20,
  NAME_MAX: 60,
  ADDRESS_MAX: 400,
  PASSWORD_MIN: 8,
  PASSWORD_MAX: 16,
  PASSWORD_REGEX: /^(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,16}$/,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
};

// Additional useful constants
export const APP_NAME = process.env.REACT_APP_NAME || 'Store Rating Platform';

export const TOAST_DURATION = {
  SUCCESS: 3000,
  ERROR: 5000,
  INFO: 4000
};

export const RATING_RANGE = {
  MIN: 1,
  MAX: 5
};

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100
};