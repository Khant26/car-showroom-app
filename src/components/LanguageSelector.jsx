import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

const LanguageSelector = () => {
  const { language, languages, changeLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleLanguageChange = (langCode) => {
    changeLanguage(langCode);
    setIsOpen(false);
  };
  
  return (
    <div className="relative">
      <button 
        onClick={toggleDropdown}
        className="flex items-center px-3 py-1 rounded-md bg-gray-200 text-gray-800"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <span className="mr-2">{language.flag}</span>
        <span>{language.name}</span>
        <span className="ml-1">▼</span>
      </button>
      
      {isOpen && (
        <div 
          className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg z-10 border border-gray-200"
          role="menu"
        >
          <ul>
            {Object.values(languages).map((lang) => (
              <li key={lang.code}>
                <button
                  onClick={() => handleLanguageChange(lang.code)}
                  className={`w-full text-left px-4 py-2 hover:bg-gray-100 ${
                    language.code === lang.code ? 'bg-gray-100' : ''
                  }`}
                >
                  <span className="mr-2">{lang.flag}</span>
                  <span>{lang.name}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;