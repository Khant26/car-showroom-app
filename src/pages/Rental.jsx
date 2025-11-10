import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import RentalCard from '../components/RentalCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { FaCar, FaCalendarAlt, FaDollarSign, FaShieldAlt } from 'react-icons/fa';
import { useLanguage } from '../context/LanguageContext';

const Rental = () => {
  const { fetchRentalCars, rentalCars, loading, pagination, updatePagination } = useApp();
  const [localLoading, setLocalLoading] = useState(true);
  const { translate } = useLanguage();

  useEffect(() => {
    const loadRentalCars = async () => {
      setLocalLoading(true);
      await fetchRentalCars();
      setLocalLoading(false);
    };
    
    loadRentalCars();
  }, []);

  const handlePageChange = (page) => {
    updatePagination('rentalCars', { page });
    fetchRentalCars();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const generatePageNumbers = () => {
    const { page, totalPages } = pagination.rentalCars;
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

  const rentalFeatures = [
    {
      icon: FaCar,
      title: translate('rental.features.selection.title'),
      description: translate('rental.features.selection.desc')
    },
    {
      icon: FaCalendarAlt,
      title: translate('rental.features.duration.title'),
      description: translate('rental.features.duration.desc')
    },
    {
      icon: FaDollarSign,
      title: translate('rental.features.rates.title'),
      description: translate('rental.features.rates.desc')
    },
    {
      icon: FaShieldAlt,
      title: translate('rental.features.insurance.title'),
      description: translate('rental.features.insurance.desc')
    }
  ];

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-black via-red-900 to-black py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl lg:text-6xl font-bold mb-6 text-gold-500">
            {translate('rental.title')}
          </h1>
          <p className="text-xl lg:text-2xl mb-8 max-w-3xl mx-auto text-gold-300">
            {translate('rental.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <a
              href="#rental-cars"
              className="bg-red-600 text-gold-200 px-8 py-3 rounded-lg font-semibold text-lg hover:bg-red-700 transition-colors duration-200"
            >
              {translate('rental.browse')}
            </a>
            <a
              href="#contact"
              className="bg-transparent border-2 border-gold-400 text-gold-400 px-8 py-3 rounded-lg font-semibold text-lg hover:bg-gold-400 hover:text-black transition-colors duration-200"
            >
              {translate('rental.contact')}
            </a>
          </div>
        </div>
      </section>      

      {/* Rental Process */}
      <section className="py-16 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gold-500 mb-4">
              {translate('rental.howItWorks')}
            </h2>
            <p className="text-xl text-gold-300 max-w-2xl mx-auto">
              {translate('rental.steps.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-black bg-opacity-50 border border-red-800 rounded-lg hover:border-gold-500 transition-all duration-300">
              <div className="bg-red-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-gold-500">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gold-400 mb-3">
                {translate('rental.steps.1.title')}
              </h3>
              <p className="text-gold-300">
                {translate('rental.steps.1.desc')}
              </p>
            </div>

            <div className="text-center p-6 bg-black bg-opacity-50 border border-red-800 rounded-lg hover:border-gold-500 transition-all duration-300">
              <div className="bg-red-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-gold-500">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gold-400 mb-3">
                {translate('rental.steps.2.title')}
              </h3>
              <p className="text-gold-300">
                {translate('rental.steps.2.desc')}
              </p>
            </div>

            <div className="text-center p-6 bg-black bg-opacity-50 border border-red-800 rounded-lg hover:border-gold-500 transition-all duration-300">
              <div className="bg-red-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-gold-500">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gold-400 mb-3">
                {translate('rental.steps.3.title')}
              </h3>
              <p className="text-gold-300">
                {translate('rental.steps.3.desc')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Available Rental Cars */}
      <section id="rental-cars" className="py-16 bg-gradient-to-r from-red-900 via-black to-red-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gold-500 mb-4">
              {translate('rental.available')}
            </h2>
            <p className="text-xl text-gold-300 max-w-2xl mx-auto">
              {translate('rental.availableSubtitle')}
            </p>
          </div>

          {localLoading || loading.rentalCars ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : (
            <>
              {rentalCars.length > 0 ? (
                <>
                  <div className="space-y-6 mb-8">
                    {rentalCars.map((rental) => (
                      <RentalCard key={rental._id} rental={rental} />
                    ))}
                  </div>

                  {/* Pagination */}
                  {pagination.rentalCars.totalPages > 1 && (
                    <div className="flex justify-center mt-8">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handlePageChange(pagination.rentalCars.page - 1)}
                          disabled={pagination.rentalCars.page === 1}
                          className="px-3 py-2 border border-red-800 text-gold-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-red-900 hover:bg-opacity-30"
                        >
                          {translate('cars.pagination.previous')}
                        </button>

                        {generatePageNumbers().map(pageNum => (
                          <button
                            key={pageNum}
                            onClick={() => handlePageChange(pageNum)}
                            className={`px-3 py-2 border rounded-lg ${
                              pageNum === pagination.rentalCars.page
                                ? 'bg-red-600 text-gold-200 border-red-600'
                                : 'border-red-800 text-gold-300 hover:bg-red-900 hover:bg-opacity-30'
                            }`}
                          >
                            {pageNum}
                          </button>
                        ))}

                        <button
                          onClick={() => handlePageChange(pagination.rentalCars.page + 1)}
                          disabled={pagination.rentalCars.page === pagination.rentalCars.totalPages}
                          className="px-3 py-2 border border-red-800 text-gold-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-red-900 hover:bg-opacity-30"
                        >
                          {translate('cars.pagination.next')}
                        </button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-12 bg-black bg-opacity-60 rounded-lg border border-red-900 p-8">
                  <div className="text-gold-400 text-lg mb-4">
                    {translate('rental.noCars')}
                  </div>
                  <p className="text-gold-300">
                    {translate('rental.newCarsMessage')}
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default Rental;