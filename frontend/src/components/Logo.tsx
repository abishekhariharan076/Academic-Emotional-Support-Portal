import React from 'react';

interface LogoProps {
  className?: string;
  type?: "full" | "mini" | "horizontal";
  light?: boolean;
  align?: "center" | "left";
}

const Logo: React.FC<LogoProps> = ({ className = "", type = "full", light = false, align = "center" }) => {
  const textColor = light ? "text-primary-light" : "text-primary";
  const subtextColor = light ? "text-primary-light/80" : "text-primary/70";

  const alignmentClass = align === "left" ? "items-start text-left" : "items-center text-center";

  if (type === "mini") {
    return (
      <div className={`flex flex-col ${alignmentClass} ${className}`}>
        <span className={`text-2xl font-black tracking-tighter ${textColor} leading-none`}>
          AESP
        </span>
      </div>
    );
  }

  if (type === "horizontal") {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        <div className="flex flex-col items-start">
          <span className={`text-xl font-bold tracking-tight ${textColor} leading-none`}>
            AESP
          </span>
          <span className={`text-[8px] uppercase tracking-widest ${subtextColor} font-medium`}>
            Support Portal
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col ${alignmentClass} ${className}`}>
      <span className={`text-5xl md:text-6xl font-bold tracking-tight ${textColor} leading-none`}>
        AESP
      </span>
      <span className={`text-[10px] md:text-xs uppercase tracking-[0.3em] ${subtextColor} mt-2 font-medium whitespace-nowrap pl-1`}>
        academic emotional support portal
      </span>
    </div>
  );
};

export default Logo;
