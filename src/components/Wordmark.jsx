import React from 'react';

// Text wordmark used in place of a logo image.
const Wordmark = ({ className = '' }) => (
  <span className={`flex items-center gap-2 font-display select-none ${className}`}>
    <span className="h-7 w-[3px] rounded-full bg-gradient-to-b from-gold-200 via-gold-400 to-gold-700" />
    <span className="leading-none">
      <span className="block text-lg font-semibold tracking-[0.18em] bg-gradient-to-r from-gold-200 via-gold-400 to-gold-600 bg-clip-text text-transparent">
        CAR SHOWROOM
      </span>
      <span className="block mt-1 text-[10px] font-medium tracking-[0.42em] text-gold-500/80">
        PREMIUM MOTORS
      </span>
    </span>
  </span>
);

export default Wordmark;
