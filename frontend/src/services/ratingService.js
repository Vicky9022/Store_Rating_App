import api from './api';

export const ratingService = {
  // Submit a new rating
  submitRating: async (ratingData) => {
    const { data } = await api.post('/ratings', ratingData);
    return data;
  },

  // Update an existing rating
  updateRating: async (ratingId, ratingData) => {
    const { data } = await api.put(`/ratings/${ratingId}`, ratingData);
    return data;
  },

  // Delete a rating (if needed)
  deleteRating: async (ratingId) => {
    const { data } = await api.delete(`/ratings/${ratingId}`);
    return data;
  },

  // Get current user's ratings
  getUserRatings: async () => {
    const { data } = await api.get('/ratings/my-ratings');
    return data;
  },

  // Get user's rating for a specific store
  getUserStoreRating: async (storeId) => {
    const { data } = await api.get(`/ratings/my-rating/${storeId}`);
    return data;
  },

  // Get all ratings for a specific store (for store owners)
  getStoreRatings: async (storeId) => {
    const { data } = await api.get(`/ratings/store/${storeId}`);
    return data;
  },

  // Get rating statistics for a store
  getStoreRatingStats: async (storeId) => {
    const { data } = await api.get(`/ratings/store/${storeId}/stats`);
    return data;
  },

  // Get recent ratings across all stores (for admin)
  getRecentRatings: async (limit = 10) => {
    const { data } = await api.get(`/ratings/recent?limit=${limit}`);
    return data;
  }
};