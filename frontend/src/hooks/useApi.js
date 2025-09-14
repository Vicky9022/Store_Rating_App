import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

export const useApi = (apiFunc, immediate = true) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(immediate);

  const execute = async (...params) => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiFunc(...params);
      setData(result);
      return result;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Something went wrong';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, []);

  return { data, error, loading, execute };
};