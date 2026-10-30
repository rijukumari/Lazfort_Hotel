import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';

export const ThemeToggle = ({ className = '' }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`relative w-9 h-9 rounded-xl flex items-center justify-center text-charcoal-muted dark:text-gray-300 hover:text-accent hover:bg-white dark:hover:bg-primary-800 border border-transparent hover:border-accent/40 shadow-sm hover:shadow-gold transition-all duration-300 active:scale-95 group ${className}`}
      title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Luxury Theme`}
      aria-label="Toggle theme"
    >
      <div className="transition-transform duration-500 ease-out group-hover:rotate-[360deg]">
        {theme === 'light' ? (
          <Moon className="w-4 h-4 text-primary group-hover:text-accent transition-colors" />
        ) : (
          <Sun className="w-4 h-4 text-accent drop-shadow-[0_0_8px_rgba(198,166,107,0.6)]" />
        )}
      </div>
    </button>
  );
};

export default ThemeToggle;

