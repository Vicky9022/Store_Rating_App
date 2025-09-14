import React, { useState } from 'react';
import { Star, MessageSquare, User, Calendar, Filter, Search, Download, ChevronDown } from 'lucide-react';
import LoadingSpinner from '../common/LoadingSpinner';

const RatingsTable = ({ ratings, loading, onRefetch }) => {
  const [sortBy, setSortBy] = useState('date'); // 'date', 'rating', 'name'
  const [sortOrder, setSortOrder] = useState('desc'); // 'asc', 'desc'
  const [filterRating, setFilterRating] = useState('all'); // 'all', '1', '2', '3', '4', '5'
  const [filterComment, setFilterComment] = useState('all'); // 'all', 'with', 'without'
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
    setCurrentPage(1); // Reset to first page when sorting
  };

  const getSortedAndFilteredRatings = () => {
    let filtered = [...ratings];
    
    // Filter by rating
    if (filterRating !== 'all') {
      filtered = filtered.filter(rating => rating.rating === parseInt(filterRating));
    }
    
    // Filter by comment presence
    if (filterComment === 'with') {
      filtered = filtered.filter(rating => rating.comment && rating.comment.trim());
    } else if (filterComment === 'without') {
      filtered = filtered.filter(rating => !rating.comment || !rating.comment.trim());
    }
    
    // Filter by search term
    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(rating => 
        rating.user?.name?.toLowerCase().includes(search) ||
        rating.user?.email?.toLowerCase().includes(search) ||
        rating.comment?.toLowerCase().includes(search)
      );
    }
    
    // Sort filtered results
    return filtered.sort((a, b) => {
      let comparison = 0;
      
      if (sortBy === 'date') {
        comparison = new Date(a.createdAt) - new Date(b.createdAt);
      } else if (sortBy === 'rating') {
        comparison = a.rating - b.rating;
      } else if (sortBy === 'name') {
        const nameA = a.user?.name || '';
        const nameB = b.user?.name || '';
        comparison = nameA.localeCompare(nameB);
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });
  };

  const sortedRatings = getSortedAndFilteredRatings();
  
  // Pagination
  const totalPages = Math.ceil(sortedRatings.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedRatings = sortedRatings.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const clearFilters = () => {
    setFilterRating('all');
    setFilterComment('all');
    setSearchTerm('');
    setCurrentPage(1);
  };

  const exportRatings = () => {
    const csvContent = [
      ['Date', 'Customer', 'Email', 'Rating', 'Comment'].join(','),
      ...sortedRatings.map(rating => [
        new Date(rating.createdAt).toLocaleDateString(),
        rating.user?.name || 'Anonymous',
        rating.user?.email || '',
        rating.rating,
        `"${rating.comment || ''}"` // Wrap comment in quotes for CSV
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `store-ratings-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="card">
        <div className="flex justify-center py-8">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Customer Reviews</h3>
          <p className="text-sm text-gray-600 mt-1">
            {sortedRatings.length} of {ratings.length} reviews
            {searchTerm && ` matching "${searchTerm}"`}
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={exportRatings}
            disabled={sortedRatings.length === 0}
            className="btn-secondary flex items-center space-x-2 disabled:opacity-50"
          >
            <Download className="h-4 w-4" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={onRefetch}
            className="btn-secondary"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search by customer name, email, or comment..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="input-field pl-10 w-full"
          />
        </div>
        
        {/* Rating Filter */}
        <div className="relative">
          <select
            value={filterRating}
            onChange={(e) => {
              setFilterRating(e.target.value);
              setCurrentPage(1);
            }}
            className="input-field pr-8 appearance-none"
          >
            <option value="all">All Ratings</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>
          <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
        </div>
        
        {/* Comment Filter */}
        <div className="relative">
          <select
            value={filterComment}
            onChange={(e) => {
              setFilterComment(e.target.value);
              setCurrentPage(1);
            }}
            className="input-field pr-8 appearance-none"
          >
            <option value="all">All Reviews</option>
            <option value="with">With Comments</option>
            <option value="without">Rating Only</option>
          </select>
          <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
        </div>
        
        {/* Sort Options */}
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600 whitespace-nowrap">Sort by:</span>
          <button
            onClick={() => handleSort('date')}
            className={`px-3 py-1 rounded text-sm transition-colors ${
              sortBy === 'date' 
                ? 'bg-blue-100 text-blue-700 font-medium' 
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Date {sortBy === 'date' && (sortOrder === 'asc' ? '↑' : '↓')}
          </button>
          <button
            onClick={() => handleSort('rating')}
            className={`px-3 py-1 rounded text-sm transition-colors ${
              sortBy === 'rating' 
                ? 'bg-blue-100 text-blue-700 font-medium' 
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Rating {sortBy === 'rating' && (sortOrder === 'asc' ? '↑' : '↓')}
          </button>
          <button
            onClick={() => handleSort('name')}
            className={`px-3 py-1 rounded text-sm transition-colors ${
              sortBy === 'name' 
                ? 'bg-blue-100 text-blue-700 font-medium' 
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Name {sortBy === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
          </button>
        </div>
        
        {/* Clear Filters */}
        {(filterRating !== 'all' || filterComment !== 'all' || searchTerm) && (
          <button
            onClick={clearFilters}
            className="text-sm text-blue-600 hover:text-blue-800 whitespace-nowrap"
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Ratings List */}
      {paginatedRatings.length > 0 ? (
        <div className="space-y-4">
          {paginatedRatings.map((rating) => (
            <div 
              key={rating._id} 
              className="border border-gray-200 rounded-lg p-6 hover:bg-gray-50 transition-colors animate-fade-in"
            >
              {/* Rating Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-4">
                  {/* Avatar */}
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-gray-600" />
                  </div>
                  
                  {/* User Info */}
                  <div>
                    <p className="font-medium text-gray-900">
                      {rating.user?.name || 'Anonymous Customer'}
                    </p>
                    <p className="text-sm text-gray-500">
                      {rating.user?.email || 'No email provided'}
                    </p>
                  </div>
                </div>
                
                {/* Rating and Date */}
                <div className="text-right">
                  <div className="flex items-center space-x-1 mb-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < rating.rating 
                            ? 'text-yellow-400 fill-current' 
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="h-4 w-4 mr-1" />
                    {new Date(rating.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
              </div>
              
              {/* Comment */}
              {rating.comment && rating.comment.trim() && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-start space-x-2">
                    <MessageSquare className="h-5 w-5 text-gray-400 mt-1 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-gray-800 leading-relaxed">
                        "{rating.comment}"
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              {/* No Comment Indicator */}
              {(!rating.comment || !rating.comment.trim()) && (
                <div className="text-center py-2">
                  <p className="text-sm text-gray-500 italic">
                    Customer left a rating without a comment
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        // Empty State
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageSquare className="h-8 w-8 text-gray-400" />
          </div>
          <h4 className="text-lg font-medium text-gray-900 mb-2">
            {ratings.length === 0 ? 'No Reviews Yet' : 'No Matching Reviews'}
          </h4>
          <p className="text-gray-600 max-w-md mx-auto">
            {ratings.length === 0 
              ? "Your store hasn't received any reviews yet. Once customers start rating your store, their feedback will appear here."
              : `No reviews match your current filters. Try adjusting your search criteria or clearing the filters.`
            }
          </p>
          {ratings.length > 0 && (
            <button
              onClick={clearFilters}
              className="btn-primary mt-4"
            >
              Clear All Filters
            </button>
          )}
        </div>
      )}
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
          <div className="text-sm text-gray-600">
            Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, sortedRatings.length)} of {sortedRatings.length} reviews
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            {/* Page Numbers */}
            <div className="flex items-center space-x-1">
              {[...Array(totalPages)].map((_, i) => {
                const page = i + 1;
                return (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-1 text-sm rounded ${
                      currentPage === page
                        ? 'bg-blue-600 text-white'
                        : 'border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
            </div>
            
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
      
      {/* Summary Footer */}
      {sortedRatings.length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-200 bg-gray-50 rounded-lg p-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-lg font-semibold text-gray-900">
                {sortedRatings.length}
              </p>
              <p className="text-sm text-gray-600">
                {filterRating !== 'all' || filterComment !== 'all' || searchTerm ? 'Filtered' : 'Total'} Reviews
              </p>
            </div>
            <div>
              <p className="text-lg font-semibold text-gray-900">
                {(sortedRatings.reduce((sum, r) => sum + r.rating, 0) / sortedRatings.length).toFixed(1)}
              </p>
              <p className="text-sm text-gray-600">Average Rating</p>
            </div>
            <div>
              <p className="text-lg font-semibold text-gray-900">
                {Math.round((sortedRatings.filter(r => r.comment && r.comment.trim()).length / sortedRatings.length) * 100)}%
              </p>
              <p className="text-sm text-gray-600">With Comments</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RatingsTable;