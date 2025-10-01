import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

const ThemeToggle = () => {
  const { themeName, toggleTheme } = useTheme();
  const { translate } = useLanguage();
  
  return (
    <button
      onClick={toggleTheme}
      className="flex items-center px-3 py-1 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
      aria-label={themeName === 'dark' ? translate('theme.light') : translate('theme.dark')}
    >
      {themeName === 'dark' ? (
        <><span className="mr-2">☀️</span>{translate('theme.light')}</>
      ) : (
        <><span className="mr-2">🌙</span>{translate('theme.dark')}</>
      )}
    </button>
  );
};

export default ThemeToggle;