import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import CarCard from '../components/CarCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { FaSearch, FaFilter, FaTimes, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const Cars = () => {
  const {
    cars,
    brands,
    loading,
    filters,
    pagination,
    updateFilters,
    resetFilters,
    updatePagination,
    fetchCars
  } = useApp();

  const { translate } = useLanguage();
  const [showFilters, setShowFilters] = useState(false);
  const [localFilters, setLocalFilters] = useState(filters);
  const [pageTitle, setPageTitle] = useState(translate('cars.title'));

  // Get page title based on current filters
  const getPageTitle = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const brandParam = urlParams.get('brand');
    
    if (brandParam && brands.length > 0) {
      // Find the brand name from the brands array
      const selectedBrand = brands.find(brand => 
        brand.name.toLowerCase() === brandParam.toLowerCase()
      );
      
      if (selectedBrand) {
        return selectedBrand.name;
      }
      
      // If brand not found in array, use the URL parameter (capitalize first letter)
      return brandParam.charAt(0).toUpperCase() + brandParam.slice(1);
    }
    
    return translate('cars.title');
  };

  // Update page title when URL changes or brands load
  useEffect(() => {
    setPageTitle(getPageTitle());
  }, [filters, brands, translate]);

  // Also update title when component mounts or URL changes
  useEffect(() => {
    const handleLocationChange = () => {
      setPageTitle(getPageTitle());
    };
    
    // Update title immediately
    handleLocationChange();
    
    // Listen for browser navigation
    window.addEventListener('popstate', handleLocationChange);
    
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
    };
  }, [brands]);

  // Categories and other filter options
  const categories = ['Sedan', 'SUV', 'Hatchback', 'Coupe', 'Convertible', 'Truck', 'Van'];
  const fuelTypes = ['Petrol', 'Diesel', 'Electric', 'Hybrid'];
  const transmissions = ['Manual', 'Automatic'];
  const sortOptions = [
    { value: 'createdAt', label: translate('cars.sort.newest') },
    { value: 'price-asc', label: translate('cars.sort.priceLow') },
    { value: 'price-desc', label: translate('cars.sort.priceHigh') },
    { value: 'year-desc', label: translate('cars.sort.yearNew') },
    { value: 'year-asc', label: translate('cars.sort.yearOld') },
    { value: 'name', label: translate('cars.sort.nameAZ') },
  ];

  // Update local filters when global filters change
  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  // Get URL params on component mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const newFilters = {};
    
    for (const [key, value] of urlParams.entries()) {
      if (value) {
        newFilters[key] = value;
      }
    }
    
    if (Object.keys(newFilters).length > 0) {
      updateFilters(newFilters);
    }
  }, []);

  const handleFilterChange = (key, value) => {
    setLocalFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const applyFilters = () => {
    updateFilters(localFilters);
    updatePagination('cars', { page: 1 });
    setShowFilters(false);
  };

  const clearFilters = () => {
    resetFilters();
    setLocalFilters(filters);
    setShowFilters(false);
  };

  const handlePageChange = (page) => {
    updatePagination('cars', { page });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const generatePageNumbers = () => {
    const { page, totalPages } = pagination.cars;
    const pages = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, page - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  };

  return (
    <div className="min-h-screen bg-black text-gold-300">
      {/* Header */}
      <div className="bg-gradient-to-r from-black via-red-900 to-black shadow-md relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1494976388531-d1058494cdd8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1950&q=80')] opacity-10 bg-cover bg-center"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
          <h1 className="text-4xl lg:text-5xl font-bold text-gold-500 mb-4 drop-shadow-lg">
            {pageTitle}
          </h1>
          <div className="h-1 w-32 bg-red-700 mb-6 opacity-80"></div>
          <p className="text-xl text-gold-300 max-w-2xl">
            {pageTitle === translate('cars.title') 
              ? translate('cars.subtitle')
              : translate('cars.brand.subtitle', { brand: pageTitle })
            }
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter Bar */}
        <div className="bg-gradient-to-b from-black to-red-950/10 border border-red-800 rounded-lg shadow-lg p-6 mb-10">
          <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4">
            {/* Search */}
            <div className="flex-1 relative">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gold-400" />
              <input
                type="text"
                placeholder={translate('cars.search')}
                value={localFilters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && applyFilters()}
                className="w-full pl-12 pr-4 py-3 bg-black border border-red-800 rounded-lg text-gold-300 placeholder-gold-600 focus:ring-2 focus:ring-gold-500 focus:border-gold-500 shadow-inner shadow-red-950/50"
              />
            </div>

            {/* Quick Sort */}
            <div className="flex space-x-3">
              <select
                value={localFilters.sort}
                onChange={(e) => {
                  handleFilterChange('sort', e.target.value);
                  setTimeout(applyFilters, 100);
                }}
                className="px-4 py-3 bg-black border border-red-800 text-gold-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500 shadow-inner shadow-red-950/50"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 px-5 py-3 bg-gradient-to-r from-red-800 to-red-700 text-gold-300 rounded-lg hover:from-red-900 hover:to-red-800 transition-all duration-300 shadow-md hover:shadow-red-900/50"
              >
                <FaFilter className={showFilters ? "rotate-180 transform" : ""} />
                <span>{translate('cars.filters')}</span>
              </button>

              <button
                onClick={applyFilters}
                className="px-6 py-3 bg-gradient-to-r from-red-700 to-red-600 text-gold-200 rounded-lg hover:from-red-800 hover:to-red-700 transition-all duration-300 shadow-md hover:shadow-red-900/50"
              >
                {translate('cars.search.button')}
              </button>
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-8 pt-8 border-t border-red-800 animate-fadeIn">
              <h3 className="text-xl font-semibold text-gold-400 mb-6 text-center">{translate('cars.filters.advanced')}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Brand Filter */}
                <div className="filter-group">
                  <label className="block text-sm font-medium text-gold-400 mb-2">
                    {translate('cars.filters.brand')}
                  </label>
                  <select
                    value={localFilters.brand}
                    onChange={(e) => handleFilterChange('brand', e.target.value)}
                    className="w-full px-4 py-3 bg-black border border-red-800 text-gold-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500 shadow-inner shadow-red-950/30"
                  >
                    <option value="">{translate('cars.filters.allBrands')}</option>
                    {brands.map(brand => (
                      <option key={brand._id} value={brand.name}>
                        {brand.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Category Filter */}
                <div className="filter-group">
                  <label className="block text-sm font-medium text-gold-400 mb-2">
                    Category
                  </label>
                  <select
                    value={localFilters.category}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                    className="w-full px-4 py-3 bg-black border border-red-800 text-gold-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500 shadow-inner shadow-red-950/30"
                  >
                    <option value="">All Categories</option>
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Fuel Type Filter */}
                <div className="filter-group">
                  <label className="block text-sm font-medium text-gold-400 mb-2">
                    Fuel Type
                  </label>
                  <select
                    value={localFilters.fuelType}
                    onChange={(e) => handleFilterChange('fuelType', e.target.value)}
                    className="w-full px-4 py-3 bg-black border border-red-800 text-gold-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500 shadow-inner shadow-red-950/30"
                  >
                    <option value="">All Fuel Types</option>
                    {fuelTypes.map(type => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Transmission Filter */}
                <div className="filter-group">
                  <label className="block text-sm font-medium text-gold-400 mb-2">
                    Transmission
                  </label>
                  <select
                    value={localFilters.transmission}
                    onChange={(e) => handleFilterChange('transmission', e.target.value)}
                    className="w-full px-4 py-3 bg-black border border-red-800 text-gold-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500 shadow-inner shadow-red-950/30"
                  >
                    <option value="">All Transmissions</option>
                    {transmissions.map(type => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price Range */}
                <div className="filter-group">
                  <label className="block text-sm font-medium text-gold-400 mb-2">
                    Min Price
                  </label>
                  <input
                    type="number"
                    placeholder="0"
                    value={localFilters.minPrice}
                    onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                    className="w-full px-4 py-3 bg-black border border-red-800 text-gold-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500 shadow-inner shadow-red-950/30"
                  />
                </div>

                <div className="filter-group">
                  <label className="block text-sm font-medium text-gold-400 mb-2">
                    Max Price
                  </label>
                  <input
                    type="number"
                    placeholder="100000"
                    value={localFilters.maxPrice}
                    onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                    className="w-full px-4 py-3 bg-black border border-red-800 text-gold-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500 shadow-inner shadow-red-950/30"
                  />
                </div>

                <div className="filter-group">
                  <label className="block text-sm font-medium text-gold-400 mb-2">
                    Year
                  </label>
                  <input
                    type="number"
                    placeholder="2020"
                    value={localFilters.year}
                    onChange={(e) => handleFilterChange('year', e.target.value)}
                    className="w-full px-4 py-3 bg-black border border-red-800 text-gold-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500 shadow-inner shadow-red-950/30"
                  />
                </div>
              </div>

              <div className="flex justify-center space-x-6 mt-8">
                <button
                  onClick={clearFilters}
                  className="px-8 py-3 border border-red-800 text-gold-400 rounded-lg hover:bg-red-900 hover:bg-opacity-30 transition-all duration-300 shadow-md hover:shadow-red-900/30"
                >
                  Clear All
                </button>
                <button
                  onClick={applyFilters}
                  className="px-8 py-3 bg-gradient-to-r from-red-700 to-red-600 text-gold-200 rounded-lg hover:from-red-800 hover:to-red-700 transition-all duration-300 shadow-md hover:shadow-red-900/50"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Results */}
        {loading.cars ? (
          <div className="flex justify-center py-16">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <>
            {/* Results Header */}
            <div className="flex justify-between items-center bg-black bg-opacity-50 p-4 rounded-lg border border-red-900/50 mb-8">
              <div className="text-gold-300 font-medium">
                Showing {cars.length} of {pagination.cars.total} cars
              </div>
              {(filters.search || filters.brand || filters.category) && (
                <button
                  onClick={clearFilters}
                  className="flex items-center space-x-2 text-gold-300 hover:text-red-500 transition-colors duration-300"
                >
                  <FaTimes className="text-red-500" />
                  <span>Clear Filters</span>
                </button>
              )}
            </div>

            {/* Cars Grid */}
            {cars.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-10">
                {cars.map((car) => (
                  <div key={car._id} className="transform hover:-translate-y-2 transition-all duration-300 hover:shadow-xl hover:shadow-red-900/20">
                    <CarCard car={car} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-gradient-to-b from-black to-red-950/10 rounded-lg border border-red-900/50 p-10 shadow-lg">
                <FaSearch className="mx-auto text-5xl text-red-600/50 mb-6" />
                <div className="text-gold-400 text-xl mb-4 font-medium">
                  No cars found matching your criteria
                </div>
                <p className="text-gold-300/70 mb-6 max-w-md mx-auto">
                  We couldn't find any vehicles that match your search filters. Try adjusting your criteria or clear the filters.
                </p>
                <button
                  onClick={clearFilters}
                  className="px-8 py-3 bg-gradient-to-r from-red-700 to-red-600 text-gold-200 rounded-lg hover:from-red-800 hover:to-red-700 transition-all duration-300 shadow-md hover:shadow-red-900/50"
                >
                  Clear filters to see all cars
                </button>
              </div>
            )}

            {/* Pagination */}
            {pagination.cars.totalPages > 1 && (
              <div className="flex justify-center mt-12 pb-6">
                <div className="flex items-center space-x-3 bg-black bg-opacity-70 px-6 py-4 rounded-full shadow-lg border border-red-900/30">
                  <button
                    onClick={() => handlePageChange(pagination.cars.page - 1)}
                    disabled={pagination.cars.page === 1}
                    className="px-5 py-2 border border-red-800 text-gold-300 rounded-full disabled:opacity-40 disabled:cursor-not-allowed hover:bg-red-900/30 transition-all duration-300 flex items-center"
                  >
                    <FaChevronLeft className="mr-2" /> Previous
                  </button>

                  {generatePageNumbers().map(pageNum => (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`w-10 h-10 flex items-center justify-center border rounded-full transition-all duration-300 ${
                        pageNum === pagination.cars.page
                          ? 'bg-gradient-to-r from-red-700 to-red-600 text-gold-200 border-red-600 shadow-md'
                          : 'border-red-800 text-gold-300 hover:bg-red-900/40 hover:border-red-700'
                      }`}
                    >
                      {pageNum}
                    </button>
                  ))}

                  <button
                    onClick={() => handlePageChange(pagination.cars.page + 1)}
                    disabled={pagination.cars.page === pagination.cars.totalPages}
                    className="px-5 py-2 border border-red-800 text-gold-300 rounded-full disabled:opacity-40 disabled:cursor-not-allowed hover:bg-red-900/30 transition-all duration-300 flex items-center"
                  >
                    Next <FaChevronRight className="ml-2" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Cars;