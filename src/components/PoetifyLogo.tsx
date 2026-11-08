import React from 'react';

interface PoetifyLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
}

export const PoetifyLogo: React.FC<PoetifyLogoProps> = ({
  size = 'md',
  showSubtitle = true,
}) => {
  const iconSizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-14 w-14',
  }[size];

  const titleSizeClasses = {
    sm: 'text-base font-bold',
    md: 'text-xl font-extrabold',
    lg: 'text-3xl font-black',
  }[size];

  return (
    <div className="flex items-center gap-3 select-none">
      {/* Brand Icon Badge */}
      <div className={`relative flex items-center justify-center shrink-0 rounded-2xl overflow-hidden shadow-lg shadow-amber-950/40 ring-1 ring-amber-400/30 ${iconSizeClasses}`}>
        <img
          src="/poetify-logo.png"
          alt="Poetify Logo"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 ring-1 ring-inset ring-amber-400/20 rounded-2xl pointer-events-none" />
      </div>

      {/* Brand Text */}
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <span className={`tracking-tight bg-gradient-to-r from-amber-200 via-teal-200 to-amber-300 bg-clip-text text-transparent ${titleSizeClasses}`}>
            Poetify
          </span>
          <span className="hidden sm:inline-block rounded-full bg-amber-400/15 border border-amber-400/30 px-2 py-0.5 text-[10px] font-semibold text-amber-300 tracking-wide uppercase">
            Studio
          </span>
        </div>
        {showSubtitle && (
          <span className="text-[11px] font-medium text-neutral-400 hidden sm:block">
            9:16 Aesthetic Poetry Video Creator
          </span>
        )}
      </div>
    </div>
  );
};
