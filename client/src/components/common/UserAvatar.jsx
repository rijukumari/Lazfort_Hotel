import React, { useState } from 'react';
import { User } from 'lucide-react';

export const DEFAULT_AVATAR = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80';

export const UserAvatar = ({
  src,
  alt = 'User',
  size = 'md', // 'sm' | 'md' | 'lg' | 'xl'
  className = '',
  ring = true,
  fallbackName = '',
}) => {
  const [hasError, setHasError] = useState(false);

  const sizeClasses = {
    xs: 'w-7 h-7 text-[10px]',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-base',
    xl: 'w-24 h-24 text-xl',
    '2xl': 'w-28 h-28 text-2xl',
  };

  const ringClasses = ring
    ? 'p-0.5 bg-gradient-to-tr from-accent via-accent/40 to-accent/90 shadow-sm'
    : '';

  const initial = fallbackName
    ? fallbackName.charAt(0).toUpperCase()
    : (alt ? alt.charAt(0).toUpperCase() : '');

  const imageSrc = !hasError && src ? src : null;

  return (
    <div
      className={`relative inline-flex items-center justify-center rounded-full overflow-hidden flex-shrink-0 ${ringClasses} ${sizeClasses[size] || sizeClasses.md} ${className}`}
    >
      {imageSrc ? (
        <img
          src={imageSrc}
          alt={alt}
          onError={() => setHasError(true)}
          className="w-full h-full rounded-full object-cover"
          loading="lazy"
        />
      ) : initial ? (
        <div className="w-full h-full rounded-full bg-accent/20 text-accent font-serif font-bold flex items-center justify-center border border-accent/30">
          {initial}
        </div>
      ) : (
        <div className="w-full h-full rounded-full bg-accent/15 text-accent flex items-center justify-center border border-accent/20">
          <User className="w-1/2 h-1/2" />
        </div>
      )}
    </div>
  );
};

export default UserAvatar;
