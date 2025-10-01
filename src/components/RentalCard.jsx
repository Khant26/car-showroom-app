import React from 'react';
import { Link } from 'react-router-dom';
import { getImageUrl } from '../utils/imageUtils';
import { useLanguage } from '../context/LanguageContext';

export default function RentalCard({ rental }) {
  const { translate } = useLanguage();
  
  if (!rental) {
    return null;
  }

  // Format dates
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Format price
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="max-w-[1300px] w-full mx-auto bg-white rounded-xl shadow-lg flex flex-row items-center p-4 sm:p-6 h-[400px]">
      <img
        src={getImageUrl(rental.image) || "https://cdn.pixabay.com/photo/2016/11/29/09/32/auto-1868726_1280.jpg"}
        alt={rental.name}
        className="w-1/3 h-full object-cover rounded-lg mr-6"
        onError={(e) => {
          e.target.src = "https://cdn.pixabay.com/photo/2016/11/29/09/32/auto-1868726_1280.jpg";
        }}
      />
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-xl font-extrabold text-gray-900 tracking-wide">
              {rental.name}
            </h3>
            <span className="px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-800">
              {translate('rental.card.available')}
            </span>
          </div>
          
          <p className="text-gray-600 mb-4">
            {rental.description}
          </p>
          
          <div className="grid grid-cols-2 gap-y-2 gap-x-6 text-sm text-gray-700 mb-4">
            <div className="flex justify-between items-center">
              <span className="font-semibold">{translate('car.brand')}:</span> 
              <span className="font-medium">{rental.brand}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-semibold">{translate('car.model')}:</span> 
              <span className="font-medium">{rental.model}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-semibold">{translate('car.engine')}:</span> 
              <span className="font-medium">{rental.engine}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-semibold">{translate('car.fuelType')}:</span> 
              <span className="font-medium">{rental.fuel}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-semibold">{translate('rental.card.topSpeed')}:</span> 
              <span className="font-medium">{rental.topSpeed}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-semibold">{translate('rental.card.color')}:</span> 
              <span className="font-medium">{rental.color}</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-y-2 gap-x-6 text-sm text-gray-700">
            <div className="flex justify-between items-center">
              <span className="font-semibold">{translate('rental.card.availableFrom')}:</span> 
              <span className="font-medium">{formatDate(rental.availableDate)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-semibold">{translate('rental.card.pricePerDay')}:</span> 
              <span className="font-bold text-green-600">{formatPrice(rental.pricePerDay)}</span>
            </div>
          </div>
        </div>

        <div className="flex gap-4 mt-4 justify-center">
          <Link to={`/rental-form/${rental._id}`}>
            <button className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition">
              {translate('rental.card.rentThisCar')}
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}