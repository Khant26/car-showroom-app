import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FaCar, 
  FaPhone, 
  FaEnvelope, 
  FaMapMarkerAlt, 
  FaFacebook, 
  FaTwitter, 
  FaInstagram, 
  FaLinkedin 
} from 'react-icons/fa';
import logo from '../assets/logo.png';
import { useLanguage } from '../context/LanguageContext';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { translate } = useLanguage();

  const quickLinks = [
    { path: '/', label: translate('nav.home') },
    { path: '/cars', label: translate('nav.cars') },
    { path: '/rental', label: translate('nav.rental') },
    { path: '/about', label: translate('nav.about') },
    { path: '/contact', label: translate('nav.contact') },
  ];

  const socialLinks = [
    { icon: FaFacebook, href: '#', label: 'Facebook' },
    { icon: FaTwitter, href: '#', label: 'Twitter' },
    { icon: FaInstagram, href: '#', label: 'Instagram' },
    { icon: FaLinkedin, href: '#', label: 'LinkedIn' },
  ];

  return (
    <footer className="bg-gradient-to-br from-black via-black-light to-black text-gold-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {/* Company Info */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <img src={logo} alt="CarShowroom Logo" className="h-14 w-auto drop-shadow-lg" />
            </div>
            <p className="text-gray-300 text-sm leading-relaxed max-w-sm">
              {translate('footer.description')}
            </p>
            <div className="flex space-x-5">
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <a
                    key={index}
                    href={social.href}
                    className="bg-black-light hover:bg-primary-600 text-gold-300 hover:text-white p-3 rounded-full transition-all duration-300 hover:scale-110 hover:shadow-lg"
                    aria-label={social.label}
                  >
                    <Icon className="text-lg" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-white relative">
              {translate('footer.quickLinks')}
              <div className="absolute bottom-0 left-0 w-12 h-0.5 bg-gradient-to-r from-primary-400 to-primary-600 mt-2"></div>
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-gray-300 hover:text-primary-400 transition-all duration-200 text-sm flex items-center group"
                  >
                    <span className="w-2 h-2 bg-primary-500 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-white relative">
              {translate('footer.contactInfo')}
              <div className="absolute bottom-0 left-0 w-12 h-0.5 bg-gradient-to-r from-primary-400 to-primary-600 mt-2"></div>
            </h3>
            <div className="space-y-4">
              <div className="group">
                <div className="flex items-start space-x-4 p-3 rounded-lg bg-black-light border border-gold-900/50 hover:border-primary-500/50 transition-all duration-300">
                  <FaPhone className="text-primary-400 flex-shrink-0 mt-1 text-lg" />
                  <div className="text-gray-300 text-sm space-y-1">
                    <div className="font-medium">02-000-0101</div>
                    <div className="font-medium">02-000-0102</div>
                  </div>
                </div>
              </div>
              
              <div className="group">
                <a 
                  href="mailto:hello@carshowroom.example"
                  className="flex items-center space-x-4 p-3 rounded-lg bg-black-light border border-gold-900/50 hover:border-primary-500/50 hover:bg-black transition-all duration-300"
                >
                  <FaEnvelope className="text-primary-400 flex-shrink-0 text-lg" />
                  <span className="text-gray-300 text-sm font-medium hover:text-primary-400 transition-colors duration-200">
                    hello@carshowroom.example
                  </span>
                </a>
              </div>
              
              <div className="group">
                <a 
                  href="https://maps.google.com/?q=Bangkok"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start space-x-4 p-3 rounded-lg bg-black-light border border-gold-900/50 hover:border-primary-500/50 hover:bg-black transition-all duration-300"
                >
                  <FaMapMarkerAlt className="text-primary-400 flex-shrink-0 mt-1 text-lg" />
                  <div className="text-gray-300 text-sm font-medium hover:text-primary-400 transition-colors duration-200">
                    88 Demo Avenue,<br />
                    Sample District, Bangkok 10000<br />
                    Thailand
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-700/50 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-400 text-sm">
              © {currentYear} {translate('footer.copyright')}
            </div>
            <div className="flex space-x-8 text-sm">
              <Link to="/privacy" className="text-gray-400 hover:text-primary-400 transition-colors duration-200 hover:underline">
                {translate('footer.privacyPolicy')}
              </Link>
              <Link to="/terms" className="text-gray-400 hover:text-primary-400 transition-colors duration-200 hover:underline">
                {translate('footer.termsOfService')}
              </Link>
              <Link to="/contact" className="text-gray-400 hover:text-primary-400 transition-colors duration-200 hover:underline">
                {translate('footer.support')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;