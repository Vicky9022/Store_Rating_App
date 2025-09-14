import React from 'react';
import StoreCard from './StoreCard';
import { Search, Star } from 'lucide-react';

const StoreList = ({ stores, onRatingSubmit, showUserRating = false, isRatingHistory = false }) => {
  if (!stores.length) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          {isRatingHistory ? (
            <Star className="h-8 w-8 text-gray-400" />
          ) : (
            <Search className="h-8 w-8 text-gray-400" />
          )}
        </div>
        <div className="text-gray-500 text-lg mb-2">
          {isRatingHistory ? 'No ratings found' : 'No stores found'}
        </div>
        <p className="text-gray-400">
          {isRatingHistory 
            ? 'You haven\'t rated any stores yet'
            : 'Try adjusting your search terms'
          }
        </p>
      </div>
    );
  }

  // Sort stores - if showing rating history, sort by rating date (newest first)
  const sortedStores = isRatingHistory 
    ? [...stores].sort((a, b) => {
        const dateA = a.userRating ? new Date(a.userRating.createdAt) : new Date(0);
        const dateB = b.userRating ? new Date(b.userRating.createdAt) : new Date(0);
        return dateB - dateA;
      })
    : stores;

  return (
    <div className="space-y-6">
      {/* Summary for rating history */}
      {isRatingHistory && stores.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {stores.length}
            </div>
            <div className="text-sm text-gray-600">Stores Rated</div>
          </div>
          
          <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {(
                (stores.reduce((sum, store) => sum + (store.userRating?.rating || 0), 0) / stores.length) || 0
              ).toFixed(1)}
            </div>
            <div className="text-sm text-gray-600">Your Avg Rating</div>
          </div>
          
          <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">
              {stores.filter(store => store.userRating?.comment?.trim()).length}
            </div>
            <div className="text-sm text-gray-600">With Comments</div>
          </div>
        </div>
      )}

      {/* Store Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedStores.map((store) => (
          <StoreCard 
            key={store._id} 
            store={store} 
             onRatingSubmit={() => onRatingSubmit(store._id)}
            showUserRating={showUserRating}
            isRatingHistory={isRatingHistory}
          />
        ))}
      </div>
    </div>
  );
};

export default StoreList;
