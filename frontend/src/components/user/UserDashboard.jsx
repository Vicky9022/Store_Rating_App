import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, Key, Star, History } from 'lucide-react';
import { storeService } from '../../services/storeService';
import { ratingService } from '../../services/ratingService';
import Header from '../common/Header';
import StoreList from './StoreList';
import LoadingSpinner from '../common/LoadingSpinner';
import PasswordModal from '../auth/PasswordModal';

const UserDashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [activeTab, setActiveTab] = useState('explore'); // 'explore' or 'my-ratings'

  // Fetch all stores
  const { data: stores, isLoading: storesLoading, refetch: refetchStores } = useQuery({
    queryKey: ['stores'],
    queryFn: storeService.getAllStores
  });

  // Fetch user's ratings
  const { data: userRatings, isLoading: ratingsLoading, refetch: refetchRatings } = useQuery({
    queryKey: ['userRatings'],
    queryFn: ratingService.getUserRatings
  });

  // Filter stores based on search
  const filteredStores = stores?.filter(store =>
    store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    store.address.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  // Combine stores with user ratings
  const storesWithUserRatings = filteredStores.map(store => {
    const userRating = userRatings?.find(rating => rating.storeId === store._id);
    return {
      ...store,
      userRating: userRating || null
    };
  });

  // Get stores user has rated
  const ratedStores = stores?.filter(store => 
    userRatings?.some(rating => rating.storeId === store._id)
  ).map(store => {
    const userRating = userRatings.find(rating => rating.storeId === store._id);
    return {
      ...store,
      userRating
    };
  }) || [];

  const handleRatingUpdate = () => {
    refetchRatings();
    refetchStores();
  };

  if (storesLoading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="User Dashboard" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {activeTab === 'explore' ? 'Explore Stores' : 'My Ratings'}
            </h2>
            <p className="text-gray-600 mt-1">
              {activeTab === 'explore' 
                ? 'Discover and rate your favorite stores' 
                : 'View and manage your store ratings'
              }
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowPasswordModal(true)}
              className="btn-secondary flex items-center space-x-2"
            >
              <Key className="h-4 w-4" />
              <span>Change Password</span>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('explore')}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'explore'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Search className="h-4 w-4" />
                <span>Explore Stores ({filteredStores.length})</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('my-ratings')}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'my-ratings'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Star className="h-4 w-4" />
                <span>My Ratings ({userRatings?.length || 0})</span>
              </div>
            </button>
          </nav>
        </div>

        {/* Search Bar (only for explore tab) */}
        {activeTab === 'explore' && (
          <div className="mb-6">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search stores by name or address..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10 w-full"
              />
            </div>
            {searchTerm && (
              <p className="text-sm text-gray-600 mt-2">
                Found {filteredStores.length} store{filteredStores.length !== 1 ? 's' : ''} matching "{searchTerm}"
              </p>
            )}
          </div>
        )}

        {/* Content based on active tab */}
        {activeTab === 'explore' ? (
          <StoreList 
            stores={storesWithUserRatings} 
            onRatingSubmit={handleRatingUpdate}
            showUserRating={true}
          />
        ) : (
          <div>
            {ratingsLoading ? (
              <div className="flex justify-center py-8">
                <LoadingSpinner />
              </div>
            ) : ratedStores.length > 0 ? (
              <div className="space-y-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center space-x-2">
                    <History className="h-5 w-5 text-blue-600" />
                    <h3 className="font-medium text-blue-900">Your Rating History</h3>
                  </div>
                  <p className="text-blue-800 text-sm mt-1">
                    You have rated {ratedStores.length} store{ratedStores.length !== 1 ? 's' : ''}. 
                    Click on any store to view or update your rating.
                  </p>
                </div>
                
                <StoreList 
                  stores={ratedStores} 
                  onRatingSubmit={handleRatingUpdate}
                  showUserRating={true}
                  isRatingHistory={true}
                />
              </div>
            ) : (
              <div className="text-center py-12">
                <Star className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-900 mb-2">No Ratings Yet</h3>
                <p className="text-gray-600 mb-6">
                  You haven't rated any stores yet. Start exploring and share your experiences!
                </p>
                <button
                  onClick={() => setActiveTab('explore')}
                  className="btn-primary"
                >
                  Explore Stores
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <PasswordModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
      />
    </div>
  );
};

export default UserDashboard;