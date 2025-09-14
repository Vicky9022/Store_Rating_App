import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useForm } from '../../hooks/useForm';
import { validateName, validateEmail, validatePassword, validateAddress } from '../../utils/validators';
import { userService } from '../../services/userService';
import { storeService } from '../../services/storeService';
import { USER_ROLES } from '../../utils/constants';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';
import toast from 'react-hot-toast';

const AddModal = ({ type, isOpen, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [owners, setOwners] = useState([]);

  const getInitialValues = () => {
    if (type === 'user') {
      return {
        name: '',
        email: '',
        password: '',
        role: USER_ROLES.USER
      };
    }
    return {
      name: '',
      email: '',     // ✅ store email
      address: '',
      owner_id: ''   // ✅ store owner id
    };
  };

  const validate = (values) => {
    const errors = {};
    
    if (type === 'user') {
      const nameError = validateName(values.name);
      const emailError = validateEmail(values.email);
      const passwordError = validatePassword(values.password);
      
      if (nameError) errors.name = nameError;
      if (emailError) errors.email = emailError;
      if (passwordError) errors.password = passwordError;
    } else {
      const nameError = validateName(values.name);
      const emailError = validateEmail(values.email);
      const addressError = validateAddress(values.address);
      if (nameError) errors.name = nameError;
      if (emailError) errors.email = emailError;
      if (addressError) errors.address = addressError;
      if (!values.owner_id) errors.owner_id = "Store owner is required";
    }
    
    return errors;
  };

  const { values, errors, handleChange, handleBlur, handleSubmit, reset } = useForm(
    getInitialValues(),
    validate
  );

  useEffect(() => {
    if (type === 'store') {
      userService.getAllUsers()
        .then(users => {
          const storeOwners = users.filter(u => u.role === USER_ROLES.STORE_OWNER);
          setOwners(storeOwners);
        })
        .catch(err => console.error("Failed to load owners", err));
    }
  }, [type]);

  const onSubmit = async (formData) => {
    console.log('Form submitted with data:', formData);
    console.log('Type:', type);
    
    setLoading(true);
    try {
      if (type === 'user') {
        console.log('Creating user...');
        const result = await userService.createUser(formData);
        console.log('User created successfully:', result);
        toast.success('User created successfully');
      } else {
        console.log('Creating store...');
        const result = await storeService.createStore(formData);
        console.log('Store created successfully:', result);
        toast.success('Store created successfully');
      }
      
      reset();
      onSuccess();
    } catch (error) {
      console.error('Error creating:', error);
      const errorMessage = error.response?.data?.message || error.message || `Failed to create ${type}`;
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    console.log('Modal closing');
    reset();
    onClose();
  };

  const handleCancel = (e) => {
    e.preventDefault();
    console.log('Cancel clicked');
    handleClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto animate-scale-up">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">
            Add New {type === 'user' ? 'User' : 'Store'}
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600"
            type="button"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              {type === 'user' ? 'Full Name' : 'Store Name'} *
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
              className="input-field mt-1"
              placeholder={`Enter ${type === 'user' ? 'full name' : 'store name'} (20-60 characters)`}
              required
            />
            <ErrorMessage message={errors.name} className="mt-1" />
          </div>

          {type === 'user' ? (
            <>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email Address *
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="input-field mt-1"
                  placeholder="Enter email address"
                  required
                />
                <ErrorMessage message={errors.email} className="mt-1" />
              </div>

              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                  Role *
                </label>
                <select
                  id="role"
                  name="role"
                  value={values.role}
                  onChange={handleChange}
                  className="input-field mt-1"
                  required
                >
                  <option value={USER_ROLES.USER}>User</option>
                  <option value={USER_ROLES.STORE_OWNER}>Store Owner</option>
                  <option value={USER_ROLES.ADMIN}>Admin</option>
                </select>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password *
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
                  required
                />
                <ErrorMessage message={errors.password} className="mt-1" />
              </div>
            </>
          ) : (
            <>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Store Email *
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="input-field mt-1"
                  placeholder="Enter store email"
                  required
                />
                <ErrorMessage message={errors.email} className="mt-1" />
              </div>

              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                  Store Address *
                </label>
                <textarea
                  id="address"
                  name="address"
                  value={values.address}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="input-field mt-1 min-h-[80px] resize-none"
                  placeholder="Enter store address (max 400 characters)"
                  required
                />
                <ErrorMessage message={errors.address} className="mt-1" />
              </div>

              <div>
                <label htmlFor="owner_id" className="block text-sm font-medium text-gray-700">
                  Store Owner *
                </label>
                <select
                  id="owner_id"
                  name="owner_id"
                  value={values.owner_id}
                  onChange={handleChange}
                  className="input-field mt-1"
                  required
                >
                  <option value="">Select Owner</option>
                  {owners.map(owner => (
                    <option key={owner.id} value={owner.id}>
                      {owner.name} ({owner.email})
                    </option>
                  ))}
                </select>
                <ErrorMessage message={errors.owner_id} className="mt-1" />
              </div>
            </>
          )}

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={handleCancel}
              className="btn-secondary flex-1"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex-1 flex justify-center items-center"
            >
              {loading ? (
                <LoadingSpinner size="sm" />
              ) : (
                `Add ${type === 'user' ? 'User' : 'Store'}`
              )}
            </button>
          </div>
        </form>

        {/* Debug Info */}
        <div className="mt-4 p-2 bg-gray-100 rounded text-xs text-gray-600">
          <div>Type: {type}</div>
          <div>Loading: {loading.toString()}</div>
          <div>Form Values: {JSON.stringify(values)}</div>
          <div>Form Errors: {JSON.stringify(errors)}</div>
        </div>
      </div>
    </div>
  );
};

export default AddModal;
