import React from 'react';
import { Link } from 'react-router-dom';
import { FaGasPump, FaCogs, FaCalendarAlt } from 'react-icons/fa';

const FeaturedRentalCard = ({ rental }) => {
  const {
    _id,
    name,
    brand,
    model,
    engine,
    fuel,
    topSpeed,
    color,
    description,
    image,
    availableDate,
    pricePerDay
  } = rental;

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105 group">
      {/* Image */}
      <div className="relative overflow-hidden">
        <img
          src={image || 'https://cdn.pixabay.com/photo/2016/11/29/09/32/auto-1868726_1280.jpg'}
          alt={name}
          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
          onError={(e) => {
            e.target.src = 'https://cdn.pixabay.com/photo/2016/11/29/09/32/auto-1868726_1280.jpg';
          }}
        />
        
        {/* Price Badge */}
        <div className="absolute top-2 right-2">
          <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
            {formatPrice(pricePerDay)}/day
          </span>
        </div>

        {/* Available Badge */}
        <div className="absolute top-2 left-2">
          <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
            Available
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Title */}
        <div className="mb-3">
          <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
            {name}
          </h3>
          <p className="text-gray-600 text-sm">
            {brand} {model}
          </p>
        </div>

        {/* Description */}
        {description && (
          <p className="text-gray-600 text-sm mb-4 overflow-hidden" style={{
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            maxHeight: '2.5rem'
          }}>
            {description}
          </p>
        )}

        {/* Specifications */}
        <div className="grid grid-cols-2 gap-2 mb-4 text-sm text-gray-600">
          <div className="flex items-center space-x-1">
            <FaCogs className="text-gray-400" />
            <span>{engine}</span>
          </div>
          <div className="flex items-center space-x-1">
            <FaGasPump className="text-gray-400" />
            <span>{fuel}</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="text-gray-400">🚗</span>
            <span>{color}</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="text-gray-400">⚡</span>
            <span>{topSpeed} km/h</span>
          </div>
        </div>

        {/* Available Date */}
        <div className="flex items-center space-x-1 text-sm text-gray-600 mb-4">
          <FaCalendarAlt className="text-gray-400" />
          <span>Available from {formatDate(availableDate)}</span>
        </div>

        {/* Action Button */}
        <Link
          to={`/rental-form/${_id}`}
          className="block w-full bg-blue-600 text-white text-center py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200"
        >
          Rent This Car
        </Link>
      </div>
    </div>
  );
};

export default FeaturedRentalCard;