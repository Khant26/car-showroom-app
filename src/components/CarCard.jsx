import React from 'react';
import { Link } from 'react-router-dom';
import { formatPrice } from '../services/api';
import { FaGasPump, FaCogs, FaUsers, FaCalendarAlt, FaArrowRight } from 'react-icons/fa';
import { useLanguage } from '../context/LanguageContext';
import { API_ORIGIN } from '../config/api';

const CarCard = ({ car, showRentalPrice = false }) => {
  const { translate } = useLanguage();
  const {
    _id,
    name,
    brand,
    year,
    price,
    rentalPrice,
    images,
    specifications,
    category,
    status,
    isRental,
    isFeatured
  } = car;

  const displayPrice = showRentalPrice && isRental ? rentalPrice : price;
  const priceLabel = showRentalPrice && isRental ? '/day' : '';

  // Helper function to get proper image URL
  const getImageUrl = (imagePath) => {
    if (!imagePath) return 'https://cdn.pixabay.com/photo/2016/11/29/09/32/auto-1868726_1280.jpg';
    
    // If it's already a full URL, return as is
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    
    // If it's a relative path (starts with /uploads), prepend server URL
    if (imagePath.startsWith('/uploads')) {
      const serverUrl = API_ORIGIN;
      return `${serverUrl}${imagePath}`;
    }
    
    // Otherwise, assume it's a relative path and return as is
    return imagePath;
  };

  return (
    <div className="bg-gradient-to-b from-black via-black to-gold-950/30 rounded-lg overflow-hidden group border border-gold-900/20 shadow-lg">
      {/* Image */}
      <div className="relative overflow-hidden h-52">
        <img
          src={getImageUrl(images?.[0])}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
        />
        
        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60"></div>
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col space-y-2">
          {isFeatured && (
            <span className="bg-gold-400 text-black px-3 py-1 rounded-full text-xs font-semibold shadow-md">
              {translate('car.featured')}
            </span>
          )}
          {isRental && showRentalPrice && (
            <span className="bg-gold-600 text-gold-200 px-3 py-1 rounded-full text-xs font-semibold shadow-md">
              {translate('car.forRent')}
            </span>
          )}
          {status === 'sold' && (
            <span className="bg-black/80 text-gold-400 border border-gold-600 px-3 py-1 rounded-full text-xs font-semibold shadow-md">
              {translate('car.soldOut')}
            </span>
          )}
        </div>
        
        {/* Car Brand Badge */}
        <div className="absolute bottom-3 right-3 bg-black/70 px-3 py-1 rounded-full">
          <span className="text-gold-400 text-xs font-medium">{brand}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Title and Category */}
        <div className="mb-3">
          <h3 className="text-lg font-semibold text-gold-300 mb-1">{name}</h3>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gold-400/80">{category}</span>
            <span className="text-sm text-gold-500 font-medium">{year}</span>
          </div>
        </div>

        {/* Specifications */}
        <div className="grid grid-cols-2 gap-y-3 gap-x-4 mb-4 text-sm">
          <div className="flex items-center space-x-2">
            <FaGasPump className="text-gold-500" />
            <span className="text-gold-400/80">{specifications?.fuelType || 'N/A'}</span>
          </div>
          <div className="flex items-center space-x-2">
            <FaCogs className="text-gold-500" />
            <span className="text-gold-400/80">{specifications?.transmission || 'N/A'}</span>
          </div>
          <div className="flex items-center space-x-2">
            <FaUsers className="text-gold-500" />
            <span className="text-gold-400/80">{specifications?.seating || 'N/A'} {translate('car.seats')}</span>
          </div>
          <div className="flex items-center space-x-2">
            <FaCalendarAlt className="text-gold-500" />
            <span className="text-gold-400/80">{year}</span>
          </div>
        </div>

        {/* Price */}
        <div className="mb-5 pt-2 border-t border-gold-900/30">
          <div className="text-2xl font-bold text-gold-400">
            {formatPrice(displayPrice)}
            {priceLabel && <span className="text-sm font-normal text-gold-300 ml-1">{priceLabel}</span>}
          </div>
          {showRentalPrice && isRental && price && (
            <div className="text-sm text-gold-300/70 mt-1">
              {translate('car.purchase')}: {formatPrice(price)}
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="flex space-x-3">
          <Link
            to={`/cars/${_id}`}
            className="flex-1 bg-gradient-to-r from-gold-700 to-gold-600 text-gold-200 text-center py-2.5 px-4 rounded-lg font-medium hover:from-gold-800 hover:to-gold-700 transition-all duration-300 shadow-md hover:shadow-gold-900/50 flex items-center justify-center group"
          >
            <span>{translate('car.viewDetails')}</span>
            <FaArrowRight className="ml-2 opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-1 transition-all duration-300" />
          </Link>
          {isRental && showRentalPrice && (
            <Link
              to="/rental"
              className="flex-1 bg-black border border-gold-700 text-gold-300 text-center py-2.5 px-4 rounded-lg font-medium hover:bg-gold-950/30 transition-all duration-300"
            >
              {translate('car.viewRentals')}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default CarCard;