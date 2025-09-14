import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useForm } from '../../hooks/useForm';
import { validatePassword } from '../../utils/validators';
import { authService } from '../../services/authService';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';
import toast from 'react-hot-toast';

const PasswordModal = ({ isOpen, onClose }) => {
  const [loading, setLoading] = useState(false);

  const validate = (values) => {
    const errors = {};
    const oldPasswordError = values.oldPassword ? null : 'Current password is required';
    const newPasswordError = validatePassword(values.newPassword);
    
    if (oldPasswordError) errors.oldPassword = oldPasswordError;
    if (newPasswordError) errors.newPassword = newPasswordError;
    
    if (values.newPassword !== values.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    return errors;
  };

  const { values, errors, handleChange, handleBlur, handleSubmit, reset } = useForm(
    { oldPassword: '', newPassword: '', confirmPassword: '' },
    validate
  );

  const onSubmit = async (formData) => {
    setLoading(true);
    try {
      await authService.changePassword({
        oldPassword: formData.oldPassword,
        newPassword: formData.newPassword
      });
      toast.success('Password changed successfully!');
      reset();
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">Change Password</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="oldPassword" className="block text-sm font-medium text-gray-700">
              Current Password
            </label>
            <input
              id="oldPassword"
              name="oldPassword"
              type="password"
              value={values.oldPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              className="input-field mt-1"
              placeholder="Enter current password"
            />
            <ErrorMessage message={errors.oldPassword} className="mt-1" />
          </div>

          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
              New Password
            </label>
            <input
              id="newPassword"
              name="newPassword"
              type="password"
              value={values.newPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              className="input-field mt-1"
              placeholder="Enter new password"
            />
            <ErrorMessage message={errors.newPassword} className="mt-1" />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
              Confirm New Password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={values.confirmPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              className="input-field mt-1"
              placeholder="Confirm new password"
            />
            <ErrorMessage message={errors.confirmPassword} className="mt-1" />
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary flex-1"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex-1 flex justify-center items-center"
            >
              {loading ? <LoadingSpinner size="sm" /> : 'Change Password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PasswordModal;