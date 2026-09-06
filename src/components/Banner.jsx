import React from 'react';
import { Link } from 'react-router-dom';
import { getImageUrl } from '../utils/imageUtils';

const Banner = ({ banner }) => {
  const {
    title,
    subtitle,
    description,
    image,
    buttonText,
    buttonLink,
    backgroundColor,
  } = banner;

  return (
    <div 
      className="relative h-96 lg:h-[500px] flex items-center justify-center overflow-hidden rounded-lg"
      style={{ backgroundColor: backgroundColor || '#f8f9fa' }}
    >
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: `url(${getImageUrl(image)})`,
          backgroundPosition: 'center',
          backgroundSize: 'cover'
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="space-y-4">
          {subtitle && (
            <p 
              className="text-lg sm:text-xl font-medium opacity-90 text-white"
            >
              {subtitle}
            </p>
          )}
          
          <h1 
            className="text-3xl sm:text-4xl lg:text-6xl font-bold leading-tight text-white"
          >
            {title}
          </h1>
          
          {description && (
            <p 
              className="text-lg sm:text-xl max-w-2xl mx-auto opacity-90 text-white"
            >
              {description}
            </p>
          )}
          
          {buttonText && buttonLink && (
            <div className="pt-4">
              <Link
                to={buttonLink}
                className="inline-block bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold text-lg hover:bg-primary-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                {buttonText}
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Banner;