import React from 'react';
import logoLight from '../assets/images/logo light nobackground.png';
import logoDark from '../assets/images/logo dark nobackground.png';
import { useApp } from '../context/ThemeLanguageContext';

export interface BrandLogoProps {
  className?: string;
  imgClassName?: string;
  textClassName?: string;
  themeOverride?: 'light' | 'dark';
  showText?: boolean;
  alt?: string;
}

export function BrandLogo({
  className = 'flex items-center gap-2',
  imgClassName = 'w-6 h-6 object-contain',
  textClassName = 'font-display font-bold text-sm tracking-tight',
  themeOverride,
  showText = false,
  alt = 'ax07.dev Logo',
}: BrandLogoProps) {
  let activeTheme = 'dark';
  try {
    const context = useApp();
    if (context && context.theme) {
      activeTheme = context.theme;
    }
  } catch {
    // If used outside provider
    activeTheme = 'dark';
  }

  const effectiveTheme = themeOverride || activeTheme;
  const logoSrc = effectiveTheme === 'dark' ? logoDark : logoLight;

  return (
    <div className={className}>
      <img
        src={logoSrc}
        alt={alt}
        className={`${imgClassName} shrink-0 transition-opacity duration-200`}
        loading="eager"
      />
      {showText && (
        <span className={textClassName}>
          AX07
        </span>
      )}
    </div>
  );
}

export { logoLight, logoDark };
