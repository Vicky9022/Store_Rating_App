import React from 'react';
import { Users, Store, Star, TrendingUp } from 'lucide-react';

const StatsCards = ({ stats }) => {
  const cards = [
    {
      title: 'Total Users',
      value: stats?.totalUsers || 10,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Total Stores',
      value: stats?.totalStores || 3,
      icon: Store,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Total Ratings',
      value: stats?.totalRatings || 2,
      icon: Star,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100'
    },
    {
      title: 'Average Rating',
      value: stats?.averageRating ? stats.averageRating.toFixed(1) : '5.0',
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => {
        const IconComponent = card.icon;
        return (
          <div key={index} className="card">
            <div className="flex items-center">
              <div className={`p-3 rounded-lg ${card.bgColor}`}>
                <IconComponent className={`h-6 w-6 ${card.color}`} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{card.title}</p>
                <p className="text-2xl font-bold text-gray-900">{card.value}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatsCards;