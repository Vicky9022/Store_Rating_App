import { useState } from 'react';

export const useForm = (initialValues, validate) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues(prev => ({ ...prev, [name]: value }));
    
    // Validate field if it's been touched and validation function exists
    if (touched[name] && validate) {
      const fieldError = validate({ [name]: value })[name];
      setErrors(prev => ({ ...prev, [name]: fieldError }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    
    // Validate field on blur
    if (validate) {
      const fieldError = validate({ [name]: values[name] })[name];
      setErrors(prev => ({ ...prev, [name]: fieldError }));
    }
  };

  const handleSubmit = (callback) => (e) => {
    e.preventDefault();
    
    // Mark all fields as touched
    const allTouched = Object.keys(values).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {});
    setTouched(allTouched);
    
    // Validate all fields if validation function exists
    if (validate) {
      const validationErrors = validate(values);
      setErrors(validationErrors);
      
      // Don't submit if there are errors
      if (Object.keys(validationErrors).some(key => validationErrors[key])) {
        return;
      }
    }
    
    // Call the submit callback with form values
    callback(values);
  };

  const reset = () => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  };

  const setValue = (name, value) => {
    setValues(prev => ({ ...prev, [name]: value }));
  };

  const setError = (name, error) => {
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    reset,
    setValue,
    setValues,
    setError,
    setErrors
  };
};