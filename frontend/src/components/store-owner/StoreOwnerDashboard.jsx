import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Key, Edit2, Store } from 'lucide-react';
import { storeService } from '../../services/storeService';
import { ratingService } from'../../services/ratingService';
import Header from '../common/Header';
import StoreStats from './StoreStats';
import RatingsTable from './RatingsTable';
import LoadingSpinner from '../common/LoadingSpinner';
import PasswordModal from '../auth/PasswordModal';
import toast from 'react-hot-toast';

const StoreOwnerDashboard = () => {
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [editingStore, setEditingStore] = useState(false);
  const [storeData, setStoreData] = useState({ name: '', address: '' });

  const { data: store, isLoading: storeLoading, refetch: refetchStore } = useQuery({
    queryKey: ['myStore'],
    queryFn: storeService.getMyStore,
    retry: false
  });

  const { data: ratings, isLoading: ratingsLoading, refetch: refetchRatings } = useQuery({
    queryKey: ['storeRatings', store?._id],
    queryFn: () => store?._id ? ratingService.getStoreRatings(store._id) : null,
    enabled: !!store?._id
  });

  const handleUpdateStore = async (e) => {
    e.preventDefault();
    try {
      await storeService.updateStore(store._id, storeData);
      toast.success('Store updated successfully');
      setEditingStore(false);
      refetchStore();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update store');
    }
  };

  const startEditing = () => {
    setStoreData({
      name: store.name,
      address: store.address
    });
    setEditingStore(true);
  };

  if (storeLoading) {
    return <LoadingSpinner fullScreen />;
  }

  if (!store) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header title="Store Owner Dashboard" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <Store className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No Store Found</h2>
            <p className="text-gray-600">
              You don't have a store associated with your account yet. 
              Please contact an administrator to set up your store.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Store Owner Dashboard" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{store.name}</h2>
            <p className="text-gray-600 mt-1">{store.address}</p>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowPasswordModal(true)}
              className="btn-secondary flex items-center space-x-2"
            >
              <Key className="h-4 w-4" />
              <span>Change Password</span>
            </button>
            <button
              onClick={startEditing}
              className="btn-primary flex items-center space-x-2"
            >
              <Edit2 className="h-4 w-4" />
              <span>Edit Store</span>
            </button>
          </div>
        </div>

        {editingStore && (
          <div className="card mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Edit Store Information</h3>
            <form onSubmit={handleUpdateStore} className="space-y-4">
              <div>
                <label htmlFor="storeName" className="block text-sm font-medium text-gray-700">
                  Store Name
                </label>
                <input
                  id="storeName"
                  type="text"
                  value={storeData.name}
                  onChange={(e) => setStoreData({...storeData, name: e.target.value})}
                  className="input-field mt-1"
                  required
                  minLength={20}
                  maxLength={60}
                />
                <p className="text-xs text-gray-500 mt-1">20-60 characters</p>
              </div>
              
              <div>
                <label htmlFor="storeAddress" className="block text-sm font-medium text-gray-700">
                  Store Address
                </label>
                <textarea
                  id="storeAddress"
                  value={storeData.address}
                  onChange={(e) => setStoreData({...storeData, address: e.target.value})}
                  className="input-field mt-1 min-h-[80px] resize-none"
                  required
                  maxLength={400}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {storeData.address.length}/400 characters
                </p>
              </div>
              
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setEditingStore(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Update Store
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <StoreStats store={store} ratings={ratings || []} />
          </div>
          
          <div className="lg:col-span-2">
            <RatingsTable 
              ratings={ratings || []} 
              loading={ratingsLoading}
              onRefetch={refetchRatings}
            />
          </div>
        </div>
      </div>

      <PasswordModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
      />
    </div>
  );
};

export default StoreOwnerDashboard;