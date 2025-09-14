import React from 'react';
import { Star, MessageSquare, TrendingUp, Users, Calendar, Award } from 'lucide-react';

const StoreStats = ({ store, ratings }) => {
  const calculateStats = () => {
    const totalRatings = ratings.length;
    const averageRating = store.averageRating || 0;
    
    // Calculate rating distribution (1-5 stars)
    const ratingDistribution = [5, 4, 3, 2, 1].map(star => ({
      star,
      count: ratings.filter(r => r.rating === star).length,
      percentage: totalRatings > 0 ? Math.round((ratings.filter(r => r.rating === star).length / totalRatings) * 100) : 0
    }));
    
    // Get recent ratings (last 5)
    const recentRatings = ratings
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);
    
    // Calculate this month's ratings
    const thisMonth = new Date().getMonth();
    const thisYear = new Date().getFullYear();
    const thisMonthRatings = ratings.filter(r => {
      const ratingDate = new Date(r.createdAt);
      return ratingDate.getMonth() === thisMonth && ratingDate.getFullYear() === thisYear;
    });
    
    // Calculate ratings with comments vs without
    const ratingsWithComments = ratings.filter(r => r.comment && r.comment.trim()).length;
    const ratingsWithoutComments = totalRatings - ratingsWithComments;
    
    return {
      totalRatings,
      averageRating,
      ratingDistribution,
      recentRatings,
      thisMonthRatings: thisMonthRatings.length,
      ratingsWithComments,
      ratingsWithoutComments,
      highestRating: Math.max(...ratings.map(r => r.rating), 0),
      lowestRating: ratings.length > 0 ? Math.min(...ratings.map(r => r.rating)) : 0
    };
  };

  const stats = calculateStats();

  const StatCard = ({ icon: Icon, title, value, subtitle, color = "blue" }) => (
    <div className={`bg-${color}-50 border border-${color}-100 rounded-lg p-4`}>
      <div className="flex items-center space-x-3">
        <div className={`p-2 bg-${color}-100 rounded-lg`}>
          <Icon className={`h-5 w-5 text-${color}-600`} />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-900">{title}</p>
          <p className={`text-2xl font-bold text-${color}-600`}>{value}</p>
          {subtitle && <p className="text-xs text-gray-600 mt-1">{subtitle}</p>}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Overview Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <StatCard
          icon={Star}
          title="Average Rating"
          value={stats.averageRating.toFixed(1)}
          subtitle={`Out of 5.0 stars`}
          color="yellow"
        />
        
        <StatCard
          icon={MessageSquare}
          title="Total Reviews"
          value={stats.totalRatings}
          subtitle={`${stats.thisMonthRatings} this month`}
          color="green"
        />
        
        <StatCard
          icon={TrendingUp}
          title="This Month"
          value={stats.thisMonthRatings}
          subtitle="New reviews"
          color="purple"
        />
        
        <StatCard
          icon={Award}
          title="Best Rating"
          value={stats.highestRating || 'N/A'}
          subtitle={stats.lowestRating ? `Lowest: ${stats.lowestRating}` : 'No ratings yet'}
          color="indigo"
        />
      </div>

      {/* Rating Distribution */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center space-x-2 mb-6">
          <Star className="h-5 w-5 text-yellow-500" />
          <h3 className="text-lg font-semibold text-gray-900">Rating Distribution</h3>
        </div>
        
        <div className="space-y-3">
          {stats.ratingDistribution.map(({ star, count, percentage }) => (
            <div key={star} className="flex items-center space-x-3">
              <div className="flex items-center space-x-1 w-12">
                <span className="text-sm font-medium text-gray-700">{star}</span>
                <Star className="h-4 w-4 text-yellow-400" />
              </div>
              
              <div className="flex-1 bg-gray-200 rounded-full h-3">
                <div
                  className="bg-yellow-400 h-3 rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              
              <div className="flex items-center space-x-2 w-20 justify-end">
                <span className="text-sm font-medium text-gray-900">{count}</span>
                <span className="text-xs text-gray-500">({percentage}%)</span>
              </div>
            </div>
          ))}
        </div>
        
        {stats.totalRatings === 0 && (
          <div className="text-center py-8">
            <Star className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No ratings yet</p>
            <p className="text-sm text-gray-400 mt-1">
              Your first customer review will appear here
            </p>
          </div>
        )}
      </div>

      {/* Review Insights */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center space-x-2 mb-6">
          <MessageSquare className="h-5 w-5 text-blue-500" />
          <h3 className="text-lg font-semibold text-gray-900">Review Insights</h3>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <p className="text-2xl font-bold text-blue-600">{stats.ratingsWithComments}</p>
            <p className="text-sm text-gray-600">With Comments</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-gray-600">{stats.ratingsWithoutComments}</p>
            <p className="text-sm text-gray-600">Rating Only</p>
          </div>
        </div>
        
        {stats.ratingsWithComments > 0 && (
          <div className="bg-blue-50 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>{Math.round((stats.ratingsWithComments / stats.totalRatings) * 100)}%</strong> of your 
              customers left detailed feedback. This helps other customers make informed decisions!
            </p>
          </div>
        )}
      </div>

      {/* Recent Reviews Preview */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-green-500" />
            <h3 className="text-lg font-semibold text-gray-900">Recent Reviews</h3>
          </div>
          {stats.recentRatings.length > 0 && (
            <span className="text-sm text-gray-500">
              Last {stats.recentRatings.length} reviews
            </span>
          )}
        </div>
        
        {stats.recentRatings.length > 0 ? (
          <div className="space-y-4">
            {stats.recentRatings.map((rating) => (
              <div key={rating._id} className="border-l-4 border-blue-400 pl-4 py-2">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < rating.rating 
                              ? 'text-yellow-400 fill-current' 
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      {rating.user?.name || 'Anonymous'}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {new Date(rating.createdAt).toLocaleDateString()}
                  </span>
                </div>
                
                {rating.comment && (
                  <p className="text-sm text-gray-700 italic line-clamp-2">
                    "{rating.comment}"
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No reviews yet</p>
            <p className="text-sm text-gray-400 mt-1">
              Customer reviews will appear here once you receive them
            </p>
          </div>
        )}
      </div>

      {/* Performance Summary */}
      {stats.totalRatings > 0 && (
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Summary</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="text-center">
              <div className={`text-2xl font-bold ${
                stats.averageRating >= 4.5 ? 'text-green-600' :
                stats.averageRating >= 3.5 ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {stats.averageRating >= 4.5 ? '🌟' : stats.averageRating >= 3.5 ? '⭐' : '📈'}
              </div>
              <p className="text-sm font-medium text-gray-900">
                {stats.averageRating >= 4.5 ? 'Excellent' :
                 stats.averageRating >= 3.5 ? 'Good' : 'Needs Improvement'}
              </p>
              <p className="text-xs text-gray-600">Overall Rating</p>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {stats.ratingsWithComments > stats.ratingsWithoutComments ? '💬' : '👍'}
              </div>
              <p className="text-sm font-medium text-gray-900">
                {stats.ratingsWithComments > stats.ratingsWithoutComments ? 'Engaging' : 'Appreciated'}
              </p>
              <p className="text-xs text-gray-600">Customer Engagement</p>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {stats.thisMonthRatings > 0 ? '📈' : '🎯'}
              </div>
              <p className="text-sm font-medium text-gray-900">
                {stats.thisMonthRatings > 0 ? 'Active' : 'Growing'}
              </p>
              <p className="text-xs text-gray-600">This Month</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StoreStats;