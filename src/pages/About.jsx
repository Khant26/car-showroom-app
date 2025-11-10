import React from 'react';
import { FaCar, FaUsers, FaHeart, FaShieldAlt } from 'react-icons/fa';
import { useLanguage } from '../context/LanguageContext';

const About = () => {
  const { translate } = useLanguage();
  
  const values = [
    {
      icon: FaCar,
      title: translate('about.values.quality.title'),
      description: translate('about.values.quality.desc')
    },
    {
      icon: FaUsers,
      title: translate('about.values.customer.title'),
      description: translate('about.values.customer.desc')
    },
    {
      icon: FaHeart,
      title: translate('about.values.passion.title'),
      description: translate('about.values.passion.desc')
    },
    {
      icon: FaShieldAlt,
      title: translate('about.values.trust.title'),
      description: translate('about.values.trust.desc')
    }
  ];

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-black via-red-900 to-black py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl lg:text-6xl font-bold mb-6 text-gold-500">{translate('about.title')}</h1>
          <p className="text-xl lg:text-2xl max-w-3xl mx-auto text-gold-300">
            {translate('about.subtitle')}
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gold-500 mb-6">
                {translate('about.story.title')}
              </h2>
              <p className="text-gold-300 text-lg mb-6">
                {translate('about.story.text1')}
              </p>
              <p className="text-gold-300 text-lg mb-6">
                {translate('about.story.text2')}
              </p>
              <p className="text-gold-300 text-lg">
                {translate('about.story.text3')}
              </p>
            </div>
            <div className="border-2 border-red-800 p-1 rounded-lg">
              <img
                src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Car Showroom"
                className="w-full h-96 object-cover rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-gradient-to-r from-red-900 via-black to-red-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gold-500 mb-4">
              {translate('about.values.title')}
            </h2>
            <p className="text-xl text-gold-300 max-w-2xl mx-auto">
              {translate('about.values.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div key={index} className="text-center p-6 bg-black bg-opacity-50 border border-red-800 rounded-lg shadow-md hover:border-gold-500 transition-all duration-300">
                  <div className="flex justify-center mb-4">
                    <Icon className="text-4xl text-red-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gold-400 mb-3">
                    {value.title}
                  </h3>
                  <p className="text-gold-300">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;