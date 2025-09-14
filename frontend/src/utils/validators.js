import { VALIDATION_RULES } from './constants';

export const validateName = (name) => {
  if (!name) return 'Name is required';
  if (name.trim().length < VALIDATION_RULES.NAME_MIN) {
    return `Name must be at least ${VALIDATION_RULES.NAME_MIN} characters`;
  }
  if (name.trim().length > VALIDATION_RULES.NAME_MAX) {
    return `Name must not exceed ${VALIDATION_RULES.NAME_MAX} characters`;
  }
  return null;
};

export const validateEmail = (email) => {
  if (!email) return 'Email is required';
  if (!VALIDATION_RULES.EMAIL_REGEX.test(email.trim())) {
    return 'Please enter a valid email address';
  }
  return null;
};

export const validatePassword = (password) => {
  if (!password) return 'Password is required';
  if (!VALIDATION_RULES.PASSWORD_REGEX.test(password)) {
    return 'Password must be 8-16 characters with at least one uppercase letter and one special character';
  }
  return null;
};

export const validateAddress = (address) => {
  if (!address) return 'Address is required';
  if (address.trim().length > VALIDATION_RULES.ADDRESS_MAX) {
    return `Address must not exceed ${VALIDATION_RULES.ADDRESS_MAX} characters`;
  }
  return null;
};

export const validateRole = (role) => {
  const validRoles = Object.values(USER_ROLES);
  if (!role) return 'Role is required';
  if (!validRoles.includes(role)) {
    return 'Please select a valid role';
  }
  return null;
};

export const validateRating = (rating) => {
  if (!rating) return 'Rating is required';
  const numRating = Number(rating);
  if (isNaN(numRating) || numRating < 1 || numRating > 5) {
    return 'Rating must be between 1 and 5';
  }
  return null;
};

export const validateComment = (comment) => {
  if (comment && comment.length > 500) {
    return 'Comment must not exceed 500 characters';
  }
  return null;
};

// Form validation helpers
export const validateLoginForm = (values) => {
  const errors = {};
  
  const emailError = validateEmail(values.email);
  if (emailError) errors.email = emailError;
  
  const passwordError = validatePassword(values.password);
  if (passwordError) errors.password = passwordError;
  
  return errors;
};

export const validateSignupForm = (values) => {
  const errors = {};
  
  const nameError = validateName(values.name);
  if (nameError) errors.name = nameError;
  
  const emailError = validateEmail(values.email);
  if (emailError) errors.email = emailError;
  
  const passwordError = validatePassword(values.password);
  if (passwordError) errors.password = passwordError;
  
  if (values.password !== values.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }
  
  const roleError = validateRole(values.role);
  if (roleError) errors.role = roleError;
  
  return errors;
};

export const validateStoreForm = (values) => {
  const errors = {};
  
  const nameError = validateName(values.name);
  if (nameError) errors.name = nameError;
  
  const addressError = validateAddress(values.address);
  if (addressError) errors.address = addressError;
  
  if (values.ownerEmail) {
    const emailError = validateEmail(values.ownerEmail);
    if (emailError) errors.ownerEmail = emailError;
  }
  
  return errors;
};

export const validateRatingForm = (values) => {
  const errors = {};
  
  const ratingError = validateRating(values.rating);
  if (ratingError) errors.rating = ratingError;
  
  const commentError = validateComment(values.comment);
  if (commentError) errors.comment = commentError;
  
  return errors;
};

// Import USER_ROLES for validateRole function
import { USER_ROLES } from './constants';