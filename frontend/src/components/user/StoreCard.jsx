import React, { useState, useEffect } from 'react';
import { MapPin, Star, MessageSquare, Edit2, Check, X, Calendar } from 'lucide-react';
import { ratingService } from '../../services/ratingService';
import RatingStars from './RatingStars';
import LoadingSpinner from '../common/LoadingSpinner';
import toast from 'react-hot-toast';

const StoreCard = ({ store, onRatingSubmit, showUserRating = false, isRatingHistory = false }) => {
  const [showRatingForm, setShowRatingForm] = useState(false);
  const [isEditingRating, setIsEditingRating] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  // Initialize form with existing rating if available
  useEffect(() => {
    if (store.userRating) {
      setRating(store.userRating.rating);
      setComment(store.userRating.comment || '');
    } else {
      setRating(0);
      setComment('');
    }
  }, [store.userRating]);

  const handleSubmitRating = async (e) => {
    e.preventDefault();

    // Validation
    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    if (rating < 1 || rating > 5) {
      toast.error('Rating must be between 1 and 5 stars');
      return;
    }

    setLoading(true);

    try {
      // Prepare data to send
      const ratingData = {
        rating: Number(rating),
        comment: comment.trim() || '', // Ensure it's a string, even if empty
      };

      let response;

      if (store.userRating) {
        // Update existing rating
         response = await ratingService.updateRating(store.userRating.id, ratingData);
        toast.success('Rating updated successfully!');
       
      } else {
        // Submit new rating
        ratingData.store_id = store.id;
         response = await ratingService.submitRating(ratingData);
        toast.success('Rating submitted successfully!');
       }
       
      store.userRating = {
        id: response.ratingId,
        rating: ratingData.rating,
        comment: ratingData.comment,
        createdAt: new Date().toISOString()
      };

      console.log('Rating response:', response);

      setShowRatingForm(false);
      setIsEditingRating(false);
      onRatingSubmit();

    } catch (error) {
      console.error('Rating submission error:', error);

      // More detailed error handling
      let errorMessage = 'Failed to submit rating';

      if (error.response) {
        // Server responded with error
        console.error('Server error response:', error.response);
        errorMessage = error.response.data?.message ||
          error.response.data?.error ||
          `Server error: ${error.response.status}`;
      } else if (error.request) {
        // Network error
        console.error('Network error:', error.request);
        errorMessage = 'Network error. Please check your connection.';
      } else {
        // Other error
        console.error('Unexpected error:', error.message);
        errorMessage = error.message;
      }

      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    if (store.userRating) {
      setRating(store.userRating.rating);
      setComment(store.userRating.comment || '');
    } else {
      setRating(0);
      setComment('');
    }
    setShowRatingForm(false);
    setIsEditingRating(false);
  };

  const startNewRating = () => {
    setRating(0);
    setComment('');
    setShowRatingForm(true);
    setIsEditingRating(false);
  };

  const startEditRating = () => {
    setShowRatingForm(true);
    setIsEditingRating(true);
  };

  return (
    <div className="card card-hover transition-shadow">
      <div className="flex flex-col h-full">
        <div className="flex-1">
          {/* Store Info */}
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">{store.name}</h3>
            {isRatingHistory && store.userRating && (
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                Rated {new Date(store.userRating.createdAt).toLocaleDateString()}
              </span>
            )}
          </div>

          <div className="flex items-start text-gray-600 mb-4">
            <MapPin className="h-4 w-4 mt-1 mr-2 flex-shrink-0" />
            <p className="text-sm line-clamp-2">{store.address}</p>
          </div>

          {/* Store Rating */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <div className="flex items-center">
                <Star className="h-4 w-4 text-yellow-400 mr-1" />
                <span className="text-sm font-medium text-gray-900">
                  {store.averageRating ? store.averageRating.toFixed(1) : '0.0'}
                </span>
              </div>
              <span className="text-sm text-gray-500">
                ({store.totalRatings || 0} reviews)
              </span>
            </div>
            <div className="text-sm text-gray-500">
              Owner: {store.owner?.name || 'Unknown'}
            </div>
          </div>

          {/* User's Current Rating Display */}
          {showUserRating && store.userRating && !showRatingForm && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium text-blue-900">Your Rating</h4>
                <button
                  onClick={startEditRating}
                  className="text-blue-600 hover:text-blue-800 p-1"
                  title="Edit your rating"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
              </div>

              <div className="flex items-center space-x-2 mb-2">
                <RatingStars rating={store.userRating.rating} size="sm" />
                <span className="text-sm text-blue-800">
                  {store.userRating.rating} star{store.userRating.rating !== 1 ? 's' : ''}
                </span>
              </div>

              {store.userRating.comment && (
                <div className="mt-2">
                  <p className="text-sm text-blue-800 italic">
                    "{store.userRating.comment}"
                  </p>
                </div>
              )}

              <div className="flex items-center text-xs text-blue-600 mt-2">
                <Calendar className="h-3 w-3 mr-1" />
                Rated on {new Date(store.userRating.createdAt).toLocaleDateString()}
              </div>
            </div>
          )}
        </div>

        {/* Rating Form or Action Buttons */}
        {!showRatingForm ? (
          <div className="space-y-2">
            {store.userRating ? (
              <div className="flex space-x-2">
                <button
                  onClick={startEditRating}
                  className="btn-secondary flex-1 flex items-center justify-center space-x-2"
                >
                  <Edit2 className="h-4 w-4" />
                  <span>Edit Rating</span>
                </button>
              </div>
            ) : (
              <button
                onClick={startNewRating}
                className="btn-primary w-full flex items-center justify-center space-x-2"
              >
                <Star className="h-4 w-4" />
                <span>Rate Store</span>
              </button>
            )}
          </div>
        ) : (
          <form onSubmit={handleSubmitRating} className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium text-gray-900">
                  {isEditingRating ? 'Edit Your Rating' : 'Rate This Store'}
                </h4>
                {isEditingRating && (
                  <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded">
                    Editing
                  </span>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Rating *
                </label>
                <RatingStars
                  rating={rating}
                  onRatingChange={setRating}
                  size="lg"
                  interactive
                />
                {rating === 0 && (
                  <p className="text-xs text-red-600 mt-1">Please select a rating</p>
                )}
              </div>

              <div>
                <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">
                  Comment (Optional)
                </label>
                <textarea
                  id="comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your experience with this store..."
                  className="input-field min-h-[80px] resize-none"
                  maxLength={500}
                />
                <div className="text-xs text-gray-500 mt-1">
                  {comment.length}/500 characters
                </div>
              </div>
            </div>

            <div className="flex space-x-2">
              <button
                type="button"
                onClick={handleCancelEdit}
                className="btn-secondary flex-1 flex items-center justify-center space-x-1"
              >
                <X className="h-4 w-4" />
                <span>Cancel</span>
              </button>
              <button
                type="submit"
                disabled={loading || rating === 0}
                className="btn-primary flex-1 flex items-center justify-center space-x-1"
              >
                {loading ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <>
                    <Check className="h-4 w-4" />
                    <span>{isEditingRating ? 'Update' : 'Submit'}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default StoreCard;

// DEBUGGING CHECKLIST - Check these things:

/*
1. BACKEND API ENDPOINTS:
   - POST /api/ratings (for new ratings)
   - PUT /api/ratings/:id (for updating ratings)
   - GET /api/ratings/my-ratings (for user's ratings)

2. REQUEST BODY FORMAT:
   For new rating: { storeId: "...", rating: 5, comment: "..." }
   For update: { rating: 5, comment: "..." }

3. AUTHENTICATION:
   - Make sure user is logged in
   - Check if JWT token is being sent in headers

4. BACKEND VALIDATION:
   - Check if backend validates rating (1-5)
   - Check if storeId exists
   - Check if user can rate the same store multiple times

5. NETWORK ISSUES:
   - Check browser console for API errors
   - Check Network tab in DevTools
   - Verify API_URL in .env file

6. DATABASE ISSUES:
   - Check if Rating model exists
   - Check if database connection is working
   - Verify field names match (rating, comment, storeId, userId)

COMMON FIXES:
*/

// Debug version of ratingService with console logs
const debugRatingService = {
  submitRating: async (ratingData) => {
    console.log('ratingService.submitRating called with:', ratingData);
    
    try {
      const response = await api.post('/ratings', ratingData);
      console.log('Rating submission successful:', response.data);
      return response.data;
    } catch (error) {
      console.error('Rating submission failed:', error);
      throw error;
    }
  },

  updateRating: async (ratingId, ratingData) => {
    console.log('ratingService.updateRating called with:', { ratingId, ratingData });
    
    try {
      const response = await api.put(`/ratings/${ratingId}`, ratingData);
      console.log('Rating update successful:', response.data);
      return response.data;
    } catch (error) {
      console.error('Rating update failed:', error);
      throw error;
    }
  },

  getUserRatings: async () => {
    console.log('ratingService.getUserRatings called');
    
    try {
      const response = await api.get('/ratings/my-ratings');
      console.log('Get user ratings successful:', response.data);
      return response.data;
    } catch (error) {
      console.error('Get user ratings failed:', error);
      throw error;
    }
  }
};

export { debugRatingService };