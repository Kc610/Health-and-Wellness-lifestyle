
import React from 'react';

const Logo: React.FC<{ className?: string }> = ({ className = "size-10" }) => {
  return (
    <div className={`relative ${className} group`}>
      <svg viewBox="0 0 100 100" className="w-full h-full fill-none stroke-current">
        {/* Pulse Background */}
        <circle cx="50" cy="50" r="45" className="stroke-primary/10" strokeWidth="2" />
        {/* Dynamic Heartbeat Wave */}
        <path 
          d="M15 50 L35 50 L40 30 L45 70 L50 10 L55 90 L60 50 L85 50" 
          className="stroke-primary group-hover:stroke-white transition-colors duration-500"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="300"
          strokeDashoffset="300"
        >
          <animate attributeName="stroke-dashoffset" from="300" to="0" dur="1.5s" fill="freeze" />
        </path>
      </svg>
      <div className="absolute inset-0 bg-primary/20 blur-xl opacity-0 group-hover:opacity-40 transition-opacity rounded-full"></div>
    </div>
  );
};

export default Logo;
