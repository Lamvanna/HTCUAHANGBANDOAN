import React from 'react';

const Logo = ({ size = "md", showText = true, className = "" }) => {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
    xl: "w-16 h-16"
  };

  const textSizeClasses = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-3xl",
    xl: "text-4xl"
  };

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      {/* Logo Image */}
      <div className={`${sizeClasses[size]} rounded-full overflow-hidden shadow-lg border-2 border-primary/20`}>
        <img
          src="/images/LOGO.png"
          alt="Na Food Logo"
          className="w-full h-full object-cover"
          onError={(e) => {
            // Fallback to a default food icon if image fails to load
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'flex';
          }}
        />
        {/* Fallback SVG Icon */}
        <div className={`${sizeClasses[size]} bg-gradient-to-br from-red-600 via-red-700 to-red-800 rounded-full flex items-center justify-center shadow-lg relative overflow-hidden`} style={{display: 'none', backgroundColor: '#AA1515'}}>
          <svg
            className="w-1/2 h-1/2 text-white relative z-10"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M2 12C2 6.48 6.48 2 12 2s10 4.48 10 10c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2z" opacity="0.8"/>
            <path d="M8 6v2M12 4v4M16 6v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
            <circle cx="9" cy="10" r="1" opacity="0.9"/>
            <circle cx="15" cy="10" r="1" opacity="0.9"/>
            <circle cx="12" cy="11" r="0.8" opacity="0.7"/>
          </svg>
          <div className="absolute top-1 left-1 w-2 h-2 bg-white rounded-full opacity-30"></div>
        </div>
      </div>

      {/* Brand Text with Lobster Font */}
      {showText && (
        <span className={`${textSizeClasses[size]} font-lobster text-primary`} style={{fontFamily: 'Lobster, cursive'}}>
          Na Food
        </span>
      )}
    </div>
  );
};

export default Logo;
