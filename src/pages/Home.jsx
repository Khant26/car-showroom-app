import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import Banner from '../components/Banner';
import BrandCard from '../components/BrandCard';
import CarCard from '../components/CarCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { Link } from 'react-router-dom';
import { FaArrowRight, FaCar, FaAward, FaUsers, FaHandshake } from 'react-icons/fa';

const Home = () => {
  const { banners, brands, featuredCars, loading } = useApp();
  const { translate } = useLanguage();
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);

  // Auto-rotate banners every 5 seconds
  React.useEffect(() => {
    if (banners.length > 1) {
      const interval = setInterval(() => {
        setCurrentBannerIndex((prev) => (prev + 1) % banners.length);
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [banners.length]);

  const features = [
    {
      title: translate('home.features.quality.title'),
      description: translate('home.features.quality.desc'),
      icon: '🏆'
    },
    {
      title: translate('home.features.prices.title'),
      description: translate('home.features.prices.desc'),
      icon: '💰'
    },
    {
      title: translate('home.features.service.title'),
      description: translate('home.features.service.desc'),
      icon: '👨‍🔧'
    },
    {
      title: translate('home.features.warranty.title'),
      description: translate('home.features.warranty.desc'),
      icon: '🛡️'
    }
  ];

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section with Banners */}
      <section className="relative">
        {loading.banners ? (
          <div className="h-96 lg:h-[500px] flex items-center justify-center bg-gray-900">
            <LoadingSpinner size="lg" />
          </div>
        ) : banners.length > 0 ? (
          <div className="relative">
            <Banner banner={banners[currentBannerIndex]} />
            
            {/* Banner Navigation Dots */}
            {banners.length > 1 && (
              <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3 bg-black bg-opacity-30 px-4 py-2 rounded-full">
                {banners.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentBannerIndex(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentBannerIndex
                        ? 'bg-gold-600 scale-125'
                        : 'bg-gold-300 bg-opacity-60 hover:bg-gold-200'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="h-96 lg:h-[500px] flex items-center justify-center bg-gradient-to-r from-black via-gold-900 to-black text-white">
            <div className="text-center">
              <h1 className="text-4xl lg:text-6xl font-bold mb-4 text-gold-400">
                {translate('home.welcome')}
              </h1>
              <p className="text-xl mb-8 text-gold-300">{translate('home.subtitle')}</p>
              <Link
                to="/cars"
                className="bg-gold-600 text-gold-200 px-8 py-3 rounded-lg font-semibold text-lg hover:bg-gold-700 transition-colors duration-200"
              >
                {translate('home.explore')}
              </Link>
            </div>
          </div>
        )}
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-r from-black via-gold-900 to-black relative">
        <div className="absolute inset-0 opacity-20 bg-pattern"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gold-500 mb-4 drop-shadow-lg">{translate('home.features.title')}</h2>
            <p className="text-xl text-gold-300 max-w-2xl mx-auto">
              {translate('home.features.subtitle')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="bg-gradient-to-b from-black to-gold-950 p-8 rounded-lg border border-gold-800 hover:border-gold-500 transition-all duration-300 shadow-lg hover:shadow-gold-900/50 transform hover:-translate-y-1"
              >
                <div className="text-4xl mb-4 flex justify-center">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-3 text-gold-400 text-center">{feature.title}</h3>
                <p className="text-gold-300 text-center">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Cars Section */}
      <section className="py-20 bg-black relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1603386329225-868f9b1ee6c9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1950&q=80')] opacity-10 bg-cover bg-center"></div>
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-gold-900/20 to-transparent"></div>
        <div className="absolute bottom-0 right-0 w-full h-32 bg-gradient-to-t from-gold-900/20 to-transparent"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-gold-500 mb-4 drop-shadow-lg">
              {translate('home.featuredCars.title')}
            </h2>
            <div className="h-1 w-32 bg-gold-700 mx-auto mb-6"></div>
            <p className="text-xl text-gold-300 max-w-2xl mx-auto">
              {translate('home.featuredCars.subtitle')}
            </p>
          </div>

          {loading.featuredCars ? (
            <div className="flex justify-center">
              <LoadingSpinner size="large" />
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {featuredCars.slice(0, 6).map((car) => (
                  <CarCard key={car._id} car={car} />
                ))}
              </div>

              {featuredCars.length > 0 && (
                <div className="text-center mt-16">
                  <Link
                    to="/cars"
                    className="inline-flex items-center space-x-3 bg-gradient-to-r from-gold-700 to-gold-600 text-gold-200 px-10 py-4 rounded-lg font-semibold text-lg hover:from-gold-800 hover:to-gold-700 transition-all duration-300 shadow-lg shadow-gold-900/30 hover:shadow-gold-900/50"
                  >
                    <span>{translate('home.featuredCars.viewAll')}</span>
                    <FaArrowRight className="animate-pulse" />
                  </Link>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Brands Section */}
      <section className="py-16 bg-gradient-to-b from-black via-black to-gold-950/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gold-500 mb-4">
              {translate('home.brands.title')}
            </h2>
            <div className="h-1 w-24 bg-gold-700 mx-auto mb-6"></div>
            <p className="text-xl text-gold-300 max-w-2xl mx-auto">
              {translate('home.brands.subtitle')}
            </p>
          </div>

          {loading.brands ? (
            <div className="flex justify-center">
              <LoadingSpinner size="lg" />
            </div>
          ) : brands.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-4 md:gap-6">
              {brands.map((brand) => (
                <div key={brand._id} className="transform hover:scale-105 transition-all duration-300">
                  <BrandCard brand={brand} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border border-gold-800 rounded-lg bg-black bg-opacity-60">
              <p className="text-gold-400 text-lg">{translate('home.noBrands')}</p>
            </div>
          )}
          
          <div className="text-center mt-12">
            <Link
              to="/cars"
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-gold-700 to-gold-600 text-gold-200 px-8 py-3 rounded-lg font-semibold text-lg hover:from-gold-800 hover:to-gold-700 transition-all duration-300 shadow-lg shadow-gold-900/30 hover:shadow-gold-900/50"
            >
              <span>{translate('home.brands.viewAll')}</span>
              <FaArrowRight className="group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;