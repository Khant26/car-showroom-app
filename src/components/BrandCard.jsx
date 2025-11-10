import React from 'react';
import { Link } from 'react-router-dom';
import { getImageUrl } from '../utils/imageUtils';

const BrandCard = ({ brand }) => {
  const { _id, name, logo } = brand;

  return (
    <Link to={`/cars?brand=${name}`} className="block group">
      <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-105 border border-gray-100 hover:border-blue-200 p-6">
        {/* Logo */}
        <div className="flex justify-center items-center mb-4 min-h-[80px]">
          <img
            src={getImageUrl(logo)}
            alt={`${name} logo`}
            className="w-16 h-16 object-contain group-hover:scale-110 transition-transform duration-300 mx-auto"
            onError={(e) => {
              e.target.src = `https://via.placeholder.com/64x64?text=${name.charAt(0)}`;
            }}
          />
        </div>

        {/* Brand Name */}
        <h3 className="text-lg font-semibold text-gray-800 text-center group-hover:text-blue-600 transition-colors duration-300">
          {name}
        </h3>
      </div>
    </Link>
  );
};

export default BrandCard;