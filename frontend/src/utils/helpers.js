// src/utils/helpers.js
/**
 * Format date to readable string
 */
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Format rating to display with one decimal place
 */
export const formatRating = (rating) => {
  return rating ? rating.toFixed(1) : '0.0';
};

/**
 * Get rating color based on value
 */
export const getRatingColor = (rating) => {
  if (rating >= 4.5) return 'text-green-600';
  if (rating >= 3.5) return 'text-yellow-600';
  if (rating >= 2.5) return 'text-orange-600';
  return 'text-red-600';
};

/**
 * Truncate text to specified length
 */
export const truncateText = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
};

/**
 * Calculate percentage
 */
export const calculatePercentage = (value, total) => {
  if (!total || total === 0) return 0;
  return Math.round((value / total) * 100);
};

/**
 * Debounce function for search inputs
 */
export const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
};

/**
 * Get user role display name
 */
export const getRoleDisplayName = (role) => {
  const roleNames = {
    admin: 'Administrator',
    store_owner: 'Store Owner',
    user: 'User'
  };
  return roleNames[role] || role;
};

/**
 * Check if user has permission for action
 */
export const hasPermission = (userRole, requiredRole) => {
  const roleHierarchy = {
    admin: 3,
    store_owner: 2,
    user: 1
  };
  return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
};

/**
 * Generate random color for avatars
 */
export const getRandomColor = (seed) => {
  const colors = [
    'bg-red-500',
    'bg-blue-500',
    'bg-green-500',
    'bg-yellow-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-indigo-500',
    'bg-gray-500'
  ];
  const index = seed.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[index % colors.length];
};

/**
 * Format address for display
 */
export const formatAddress = (address, maxLength = 50) => {
  if (!address) return 'No address provided';
  return truncateText(address, maxLength);
};

/**
 * Validate file size and type
 */
export const validateFile = (file, maxSizeMB = 5, allowedTypes = ['image/jpeg', 'image/png']) => {
  const errors = [];
  
  if (file.size > maxSizeMB * 1024 * 1024) {
    errors.push(`File size should be less than ${maxSizeMB}MB`);
  }
  
  if (!allowedTypes.includes(file.type)) {
    errors.push(`File type should be one of: ${allowedTypes.join(', ')}`);
  }
  
  return errors;
};

/**
 * Get initials from name
 */
export const getInitials = (name) => {
  if (!name) return 'U';
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
};