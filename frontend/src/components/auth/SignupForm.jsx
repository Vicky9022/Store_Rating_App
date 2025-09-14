import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useForm } from '../../hooks/useForm';
import { validateName, validateEmail, validatePassword } from '../../utils/validators';
import { USER_ROLES } from '../../utils/constants';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';
import toast from 'react-hot-toast';

const SignupForm = () => {
  const { register } = useAuth();
  const [loading, setLoading] = useState(false);

  const validate = (values) => {
    const errors = {};
    const nameError = validateName(values.name);
    const emailError = validateEmail(values.email);
    const passwordError = validatePassword(values.password);
    
    if (nameError) errors.name = nameError;
    if (emailError) errors.email = emailError;
    if (passwordError) errors.password = passwordError;
    
    if (values.password !== values.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    return errors;
  };

  const { values, errors, handleChange, handleBlur, handleSubmit } = useForm(
    { 
      name: '', 
      email: '', 
      password: '', 
      confirmPassword: '', 
      role: USER_ROLES.USER 
    },
    validate
  );

  const onSubmit = async (formData) => {
    setLoading(true);
    try {
      const { confirmPassword, ...registrationData } = formData;
      await register(registrationData);
      toast.success('Registration successful!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={values.name}
                onChange={handleChange}
                onBlur={handleBlur}
                className="input-field mt-1"
                placeholder="Enter your full name (20-60 characters)"
              />
              <ErrorMessage message={errors.name} className="mt-1" />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                className="input-field mt-1"
                placeholder="Enter your email"
              />
              <ErrorMessage message={errors.email} className="mt-1" />
            </div>

            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                Account Type
              </label>
              <select
                id="role"
                name="role"
                value={values.role}
                onChange={handleChange}
                className="input-field mt-1"
              >
                <option value={USER_ROLES.USER}>User</option>
                <option value={USER_ROLES.STORE_OWNER}>Store Owner</option>
                <option value={USER_ROLES.ADMIN}>Admin</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                className="input-field mt-1"
                placeholder="8-16 chars, 1 uppercase, 1 special char"
              />
              <ErrorMessage message={errors.password} className="mt-1" />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={values.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                className="input-field mt-1"
                placeholder="Confirm your password"
              />
              <ErrorMessage message={errors.confirmPassword} className="mt-1" />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex justify-center items-center"
            >
              {loading ? <LoadingSpinner size="sm" /> : 'Sign up'}
            </button>
          </div>

          <div className="text-center">
            <Link
              to="/login"
              className="text-blue-600 hover:text-blue-500 text-sm font-medium"
            >
              Already have an account? Sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignupForm;