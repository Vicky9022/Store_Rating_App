import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { userService } from '../../services/userService';
import { storeService } from '../../services/storeService';
import Header from '../common/Header';
import StatsCards from './StatsCards';
import UsersTable from './UsersTable';
import StoresTable from './StoresTable';
import AddModal from './AddModal';
import LoadingSpinner from '../common/LoadingSpinner';
import { Plus } from 'lucide-react';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [modalType, setModalType] = useState(null); // ✅ FIXED: Initialize as null, not 'users'

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['stats'],
    queryFn: userService.getStats
  });

  const { data: users, isLoading: usersLoading, refetch: refetchUsers } = useQuery({
    queryKey: ['users'],
    queryFn: userService.getAllUsers
  });

  const { data: stores, isLoading: storesLoading, refetch: refetchStores } = useQuery({
    queryKey: ['stores'],
    queryFn: storeService.getAllStores
  });

  const tabs = [
    { id: 'users', label: 'Users', count: users?.length || 0 },
    { id: 'stores', label: 'Stores', count: stores?.length || 0 }
  ];

  

  // ✅ FIXED: Handle modal open/close properly
  const handleAddClick = () => {
    const type = activeTab === 'users' ? 'user' : 'store';
    console.log('Opening modal for:', type); // Debug log
    setModalType(type);
  };

  const handleModalClose = () => {
    console.log('Closing modal'); // Debug log
    setModalType(null);
  };

  const handleModalSuccess = () => {
    console.log('Modal success, type was:', modalType); // Debug log
    if (modalType === 'user') {
      refetchUsers();
    } else if (modalType === 'store') {
      refetchStores();
    }
    setModalType(null);
  };

  if (statsLoading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Admin Dashboard" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ✅ FIXED: Add debug info for stats */}
        <div className="mb-4">
          <p className="text-xs text-gray-500">
            Stats loading: {statsLoading.toString()} | 
            Stats data: {stats ? 'Available' : 'Null'} |
            Users: {users?.length || 0} |
            Stores: {stores?.length || 0}
          </p>
        </div>
        
        <StatsCards stats={stats} />

        <div className="mt-8">
          <div className="flex justify-between items-center mb-6">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {tab.label} ({tab.count})
                  </button>
                ))}
              </nav>
            </div>

            {/* ✅ FIXED: Use proper handler function */}
            <button
              onClick={handleAddClick}
              className="btn-primary flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Add {activeTab === 'users' ? 'User' : 'Store'}</span>
            </button>
          </div>

          {activeTab === 'users' && (
            <UsersTable 
              users={users} 
              loading={usersLoading} 
              onRefetch={refetchUsers}
            />
          )}
          
          {activeTab === 'stores' && (
            <StoresTable 
              stores={stores} 
              loading={storesLoading} 
              onRefetch={refetchStores}
            />
          )}
        </div>
      </div>

      {/* ✅ FIXED: Use proper handlers and conditional rendering */}
      {modalType && (
        <AddModal
          type={modalType}
          isOpen={true}
          onClose={handleModalClose}
          onSuccess={handleModalSuccess}
        />
      )}
      
      {/* ✅ DEBUG: Show modal state */}
      <div className="fixed bottom-4 right-4 bg-black text-white p-2 text-xs rounded">
        Modal Type: {modalType || 'null'}
      </div>
    </div>
  );
};

export default AdminDashboard;