

import React from 'react';

const Logo: React.FC<{ className?: string }> = ({ className = "size-10" }) => {
  return (
    <div className={`relative ${className} group cursor-pointer`}>
      <svg viewBox="0 0 100 100" className="w-full h-full fill-none stroke-current">
        {/* Pulse Background Ring */}
        <circle cx="50" cy="50" r="45" className="stroke-primary/20 animate-pulse-slow" strokeWidth="2" />
        <circle cx="50" cy="50" r="35" className="stroke-primary/10" strokeWidth="1" />
        
        {/* Dynamic Heartbeat Wave */}
        <path 
          d="M10 50 L30 50 L35 30 L40 70 L45 10 L50 90 L55 50 L90 50" 
          className="stroke-primary group-hover:stroke-white transition-colors duration-500 animate-dash-animate" /* Added animate-dash-animate */
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="400"
        />
      </svg>
      {/* Visual Bloom */}
      <div className="absolute inset-0 bg-primary/30 blur-2xl opacity-0 group-hover:opacity-60 transition-opacity rounded-full"></div>
      <div className="absolute inset-2 border border-primary/40 rounded-full animate-ping-slow opacity-0 group-hover:opacity-100"></div>
    </div>
  );
};

export default Logo;
