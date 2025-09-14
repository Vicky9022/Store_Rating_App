import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useForm } from '../../hooks/useForm';
import { validateEmail, validatePassword } from '../../utils/validators';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';
import toast from 'react-hot-toast';


const LoginForm = () => {
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);

  const validate = (values) => {
    const errors = {};
    const emailError = validateEmail(values.email);
    const passwordError = validatePassword(values.password);
    
    if (emailError) errors.email = emailError;
    if (passwordError) errors.password = passwordError;
    
    return errors;
  };

  const { values, errors, handleChange, handleBlur, handleSubmit } = useForm(
    { email: '', password: '' },
    validate
  );

  const onSubmit = async (formData) => {
    setLoading(true);
    try {
      await login(formData);
      toast.success('Login successful!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
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
                placeholder="Enter your password"
              />
              <ErrorMessage message={errors.password} className="mt-1" />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex justify-center items-center"
            >
              {loading ? <LoadingSpinner size="sm" /> : 'Sign in'}
            </button>
          </div>

          <div className="text-center">
            <Link
              to="/signup"
              className="text-blue-600 hover:text-blue-500 text-sm font-medium"
            >
              Don't have an account? Sign up
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;