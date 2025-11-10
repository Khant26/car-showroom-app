import React from 'react';
import { Link } from 'react-router-dom';
import { FaCarCrash } from 'react-icons/fa'; // Import car crash icon

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="text-center px-4 py-8 rounded-lg border-2 border-red-800 bg-black/50 backdrop-blur-sm">
        <FaCarCrash className="mx-auto text-8xl sm:text-9xl text-red-600 mb-6 animate-pulse" />
        <div className="text-6xl sm:text-7xl font-bold text-gold-500 mb-4">404</div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-4">
          Lost Your Way?
        </h1>
        <p className="text-gold-300 mb-8 max-w-md">
          Looks like you've taken a wrong turn. Don't worry, our showroom is just a click away.
        </p>
        <Link
          to="/"
          className="inline-block bg-red-600 text-white px-8 py-3 rounded-lg 
                     hover:bg-red-700 transition-all duration-300 
                     transform hover:scale-105 hover:shadow-lg 
                     border border-red-500 hover:border-red-400"
        >
          Return to Showroom
        </Link>
      </div>
    </div>
  );
};

export default NotFound;