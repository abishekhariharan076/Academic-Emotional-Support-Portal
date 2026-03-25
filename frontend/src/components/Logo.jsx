import React from 'react';

const Logo = ({ className = "", type = "full", light = false }) => {
  // Use the new primary and primary-light (mint) colors from theme
  const bgColor = light ? "bg-primary-light" : "bg-primary";
  const textColor = light ? "text-primary" : "text-primary-light";

  if (type === "mini") {
    return (
      <div className={`flex items-center justify-center rounded-lg font-bold ${bgColor} ${textColor} ${className}`}>
        AE
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center justify-center text-center ${className}`}>
      <span className={`text-4xl font-bold tracking-tight ${textColor} leading-none`}>
        AESP
      </span>
      <span className={`text-[10px] uppercase tracking-[0.2em] ${textColor} mt-1 font-medium opacity-90 whitespace-nowrap`}>
        academic emotional support portal
      </span>
    </div>
  );
};

export default Logo;
