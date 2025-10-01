import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { carAPI, formatPrice, formatDate, handleApiError } from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import LoadingSpinner from '../components/LoadingSpinner';
import { 
  FaGasPump, 
  FaCogs, 
  FaUsers, 
  FaCalendarAlt, 
  FaTachometerAlt,
  FaArrowLeft,
  FaArrowRight,
  FaSearchPlus,
  FaSearchMinus,
  FaCompress
} from 'react-icons/fa';
import { Link } from 'react-router-dom';

const CarDetail = () => {
  const { id } = useParams();
  const { translate } = useLanguage();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Helper function to get proper image URL
  const getImageUrl = (imagePath) => {
    if (!imagePath) return '/placeholder-car.jpg';
    
    // If it's already a full URL, return as is
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    
    // If it's a relative path (starts with /uploads), prepend server URL
    if (imagePath.startsWith('/uploads')) {
      const serverUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';
      return `${serverUrl}${imagePath}`;
    }
    
    // Otherwise, assume it's a relative path and return as is
    return imagePath;
  };

  useEffect(() => {
    fetchCarDetails();
  }, [id]);

  const fetchCarDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await carAPI.getById(id);
      setCar(response.data.data);
    } catch (error) {
      setError(handleApiError(error));
    } finally {
      setLoading(false);
    }
  };

  const nextImage = () => {
    if (car?.images) {
      setCurrentImageIndex((prev) => (prev + 1) % car.images.length);
    }
  };

  const prevImage = () => {
    if (car?.images) {
      setCurrentImageIndex((prev) => (prev - 1 + car.images.length) % car.images.length);
    }
  };

  // Zoom functions
  const zoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.5, 3));
  };

  const zoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.5, 0.5));
  };

  const resetZoom = () => {
    setZoomLevel(1);
    setImagePosition({ x: 0, y: 0 });
  };

  // Handle double click to toggle zoom
  const handleDoubleClick = (e) => {
    if (zoomLevel > 1) {
      // If already zoomed in, reset zoom
      resetZoom();
    } else {
      // Zoom in to 2x
      setZoomLevel(2);
    }
  };

  const closeModal = () => {
    setIsImageModalOpen(false);
    setZoomLevel(1);
    setImagePosition({ x: 0, y: 0 });
    setIsDragging(false);
  };

  // Mouse events for dragging
  const handleMouseDown = (e) => {
    if (zoomLevel > 1) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - imagePosition.x,
        y: e.clientY - imagePosition.y
      });
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging && zoomLevel > 1) {
      setImagePosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch events for mobile
  const handleTouchStart = (e) => {
    if (zoomLevel > 1 && e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].clientX - imagePosition.x,
        y: e.touches[0].clientY - imagePosition.y
      });
    }
  };

  const handleTouchMove = (e) => {
    if (isDragging && zoomLevel > 1 && e.touches.length === 1) {
      e.preventDefault();
      setImagePosition({
        x: e.touches[0].clientX - dragStart.x,
        y: e.touches[0].clientY - dragStart.y
      });
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center bg-black bg-opacity-70 p-10 rounded-lg border border-red-900/30 shadow-lg max-w-md">
          <h2 className="text-2xl font-bold text-gold-400 mb-4">Error Loading Car</h2>
          <p className="text-gold-300 mb-6">{error}</p>
          <Link
            to="/cars"
            className="bg-gradient-to-r from-red-700 to-red-600 text-gold-200 px-6 py-3 rounded-lg hover:from-red-800 hover:to-red-700 transition-all duration-300 shadow-md hover:shadow-red-900/50 inline-flex items-center"
          >
            <FaArrowLeft className="mr-2" /> Back to Cars
          </Link>
        </div>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center bg-black bg-opacity-70 p-10 rounded-lg border border-red-900/30 shadow-lg max-w-md">
          <h2 className="text-2xl font-bold text-gold-400 mb-4">Car Not Found</h2>
          <p className="text-gold-300 mb-6">Sorry, we couldn't find the car you're looking for.</p>
          <Link
            to="/cars"
            className="bg-gradient-to-r from-red-700 to-red-600 text-gold-200 px-6 py-3 rounded-lg hover:from-red-800 hover:to-red-700 transition-all duration-300 shadow-md hover:shadow-red-900/50 inline-flex items-center"
          >
            <FaArrowLeft className="mr-2" /> Back to Cars
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-red-950/10">
      {/* Navigation */}
      <div className="bg-black shadow-md border-b border-red-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            to="/cars"
            className="inline-flex items-center space-x-2 text-gold-400 hover:text-red-500 transition-all duration-300 group"
          >
            <FaArrowLeft className="transform group-hover:-translate-x-1 transition-transform duration-300" />
            <span>Back to Cars</span>
          </Link>
        </div>
      </div>

      {/* Car Title - Premium Styling */}
      <div className="bg-gradient-to-r from-gold-600 via-gold-500 to-gold-600 py-8 shadow-md relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/assets/patterns/pattern-gold.png')] opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-block px-4 py-1 bg-black text-gold-400 text-sm font-medium rounded-full mb-3">
            {car.brand} • {car.category}
          </div>
          <h1 className="text-5xl font-bold text-black">{car.name}</h1>
        </div>
      </div>

      {/* Image Gallery with Premium Styling */}
      <div className="w-full bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Main Image - Enhanced Styling */}
          <div className="relative bg-gradient-to-b from-red-950/10 to-black rounded-lg overflow-hidden p-4 shadow-lg border border-red-900/20">
            <img
              src={getImageUrl(car.images?.[currentImageIndex])}
              alt={car.name}
              className="w-full h-[60vh] object-contain cursor-zoom-in mx-auto hover:scale-105 transition-transform duration-500"
              onClick={() => setIsImageModalOpen(true)}
            />
            
            {/* Image Navigation - Improved Styling */}
            {car.images && car.images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-6 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-60 text-gold-400 p-3 rounded-full hover:bg-red-900 hover:text-gold-300 transition-all duration-300 shadow-lg"
                >
                  <FaArrowLeft size={20} />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-6 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-60 text-gold-400 p-3 rounded-full hover:bg-red-900 hover:text-gold-300 transition-all duration-300 shadow-lg"
                >
                  <FaArrowRight size={20} />
                </button>
              </>
            )}

            {/* Image Counter - Enhanced */}
            {car.images && car.images.length > 1 && (
              <div className="absolute bottom-6 right-6 bg-black bg-opacity-70 text-gold-400 px-4 py-2 rounded-full text-sm font-medium border border-red-900/30 shadow-md">
                {currentImageIndex + 1} / {car.images.length}
              </div>
            )}
            
            {/* Zoom Icon */}
            <div className="absolute bottom-6 left-6 bg-black bg-opacity-70 text-gold-400 px-4 py-2 rounded-full text-sm font-medium border border-red-900/30 shadow-md flex items-center">
              <FaSearchPlus className="mr-2" /> Click to view fullscreen
            </div>
          </div>

          {/* Thumbnail Images Row - Larger and More Prominent */}
          {car.images && car.images.length > 1 && (
            <div className="px-4 sm:px-6 lg:px-8 py-4">
              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2 justify-items-center">
                {car.images.map((image, index) => (
                  <div 
                    key={index} 
                    className={`relative cursor-pointer ${
                      index === currentImageIndex
                        ? 'ring-2 ring-red-500 ring-offset-2 ring-offset-gray-900'
                        : 'opacity-70 hover:opacity-100'
                    }`}
                    onClick={() => setCurrentImageIndex(index)}
                  >
                    <img
                      src={getImageUrl(image)}
                      alt={`${car.name} - ${index + 1}`}
                      className="h-16 w-16 sm:h-20 sm:w-20 object-cover rounded transition-all duration-200"
                    />
                    {index === currentImageIndex && (
                      <div className="absolute inset-0 border-2 border-red-500 rounded"></div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Car Details Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Alternating Left-Right Sections for Details and Specs */}
        <div className="mb-12">
          {/* Row 1: Car Details (Left) and Key Specifications (Right) */}
          <div className="flex flex-col md:flex-row mb-12">
            {/* Car Details - Left */}
            <div className="w-full md:w-1/2 md:pr-6">
              <h3 className="text-2xl font-semibold text-gold-500 mb-6 md:text-left text-center">{translate('car.details')}</h3>
              <div className="bg-black-light rounded-lg shadow-md p-6 border border-gold-900/30">
                <div className="space-y-4">
                  <div className="flex justify-between border-b border-gold-600 py-2">
                    <span className="text-gold-400">{translate('car.brand')}</span>
                    <span className="font-medium text-gold-200">{car.brand}</span>
                  </div>
                  <div className="flex justify-between border-b border-gold-600 py-2">
                    <span className="text-gold-400">{translate('car.model')}</span>
                    <span className="font-medium text-gold-200">{car.model}</span>
                  </div>
                  <div className="flex justify-between border-b border-gold-600 py-2">
                    <span className="text-gold-400">{translate('car.year')}</span>
                    <span className="font-medium text-gold-200">{car.year}</span>
                  </div>
                  <div className="flex justify-between border-b border-gold-600 py-2">
                    <span className="text-gold-400">{translate('car.category')}</span>
                    <span className="font-medium capitalize text-gold-200">{car.category}</span>
                  </div>
                  <div className="flex justify-between border-b border-gold-600 py-2">
                    <span className="text-gold-400">{translate('car.status')}</span>
                    <span className="font-medium capitalize text-gold-200">{car.status}</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Key Specifications - Right */}
            <div className="w-full md:w-1/2 md:pl-6 mt-8 md:mt-0">
              <h3 className="text-2xl font-semibold text-gold-500 mb-6 md:text-left text-center">{translate('car.specs')}</h3>
              <div className="bg-black-light rounded-lg shadow-md p-6 border border-gold-900/30">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-4 p-4 bg-black rounded-lg border border-gold-700/50">
                    <FaGasPump className="text-red-600 text-2xl" />
                    <div>
                      <div className="text-sm text-gold-400">{translate('car.fuelType')}</div>
                      <div className="font-medium text-lg text-gold-200">{car.specifications?.fuelType}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 p-4 bg-black rounded-lg border border-gold-700/50">
                    <FaCogs className="text-red-600 text-2xl" />
                    <div>
                      <div className="text-sm text-gold-400">{translate('car.transmission')}</div>
                      <div className="font-medium text-lg text-gold-200">{car.specifications?.transmission}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 p-4 bg-black rounded-lg border border-gold-700/50">
                    <FaUsers className="text-red-600 text-2xl" />
                    <div>
                      <div className="text-sm text-gold-400">{translate('car.seating')}</div>
                      <div className="font-medium text-lg text-gold-200">{car.specifications?.seating} {translate('car.seats')}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 p-4 bg-black rounded-lg border border-gold-700/50">
                    <FaTachometerAlt className="text-red-600 text-2xl" />
                    <div>
                      <div className="text-sm text-gold-400">{translate('car.engine')}</div>
                      <div className="font-medium text-lg text-gold-200">{car.specifications?.engine}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Row 2: Description (Left) and Full Specifications (Right) */}
          <div className="flex flex-col md:flex-row mb-12">
            {/* Description - Left */}
            <div className="w-full md:w-1/2 md:pr-6">
              <h3 className="text-2xl font-semibold text-gold-500 mb-6 md:text-left text-center">{translate('car.description')}</h3>
              <div className="bg-black-light rounded-lg shadow-md p-6 border border-gold-900/30">
                <p className="text-gold-300 leading-relaxed">{car.description}</p>
              </div>
            </div>
            
            {/* Full Specifications - Right */}
            <div className="w-full md:w-1/2 md:pl-6 mt-8 md:mt-0">
              <h3 className="text-2xl font-semibold text-gold-500 mb-6 md:text-left text-center">{translate('car.fullSpecifications')}</h3>
              <div className="bg-black-light rounded-lg shadow-md p-6 border border-gold-900/30">
                <div className="grid grid-cols-1 gap-y-3">
                  {Object.entries(car.specifications || {}).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-2 border-b border-gold-800/30">
                      <span className="text-gold-400 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                      <span className="font-medium text-gold-200">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Features Section - Full Width at Bottom */}
          {car.features && car.features.length > 0 && (
            <div className="w-full">
              <h3 className="text-2xl font-semibold text-gold-500 mb-6 text-center">{translate('car.features')}</h3>
              <div className="bg-black-light rounded-lg shadow-md p-8 border border-gold-900/30">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {car.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-red-600 rounded-full"></div>
                      <span className="text-gold-300">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Image Modal */}
      {isImageModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-4xl max-h-full overflow-hidden">
            <div 
              className="relative overflow-hidden"
              style={{ 
                width: '100%', 
                height: '80vh',
                cursor: zoomLevel > 1 ? (isDragging ? 'grabbing' : 'grab') : 'zoom-in'
              }}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              onDoubleClick={handleDoubleClick}
            >
              <img
                src={getImageUrl(car.images?.[currentImageIndex])}
                alt={car.name}
                className="max-w-full max-h-full object-contain transition-transform duration-300"
                style={{
                  transform: `scale(${zoomLevel}) translate(${imagePosition.x / zoomLevel}px, ${imagePosition.y / zoomLevel}px)`,
                  transformOrigin: 'center center'
                }}
                draggable={false}
                onDragStart={(e) => e.preventDefault()}
              />
              {zoomLevel > 1 && (
                <div className="absolute bottom-4 right-4 bg-black bg-opacity-70 text-white px-3 py-1 rounded-full text-sm">
                  Double-click to reset zoom
                </div>
              )}
            </div>
            
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-white text-2xl hover:text-gray-300 bg-black bg-opacity-50 rounded-full w-10 h-10 flex items-center justify-center"
            >
              ×
            </button>
            
            {/* Zoom Instruction (only shown when not zoomed) */}
            {zoomLevel === 1 && (
              <div className="absolute bottom-4 left-4 text-white bg-black bg-opacity-50 px-3 py-1 rounded-full text-sm">
                {translate('car.doubleClickToZoom')}
              </div>
            )}

            {/* Navigation Arrows */}
            {car.images && car.images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white text-2xl hover:text-gray-300 bg-black bg-opacity-50 rounded-full w-12 h-12 flex items-center justify-center"
                >
                  <FaArrowLeft />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white text-2xl hover:text-gray-300 bg-black bg-opacity-50 rounded-full w-12 h-12 flex items-center justify-center"
                >
                  <FaArrowRight />
                </button>
              </>
            )}

            {/* Image Counter */}
            {car.images && car.images.length > 1 && (
              <div className="absolute bottom-4 right-4 text-white bg-black bg-opacity-50 px-3 py-1 rounded-full text-sm">
                {currentImageIndex + 1} / {car.images.length}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CarDetail;