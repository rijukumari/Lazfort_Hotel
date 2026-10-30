import React, { useState } from 'react';
import { Menu, Search } from 'lucide-react';
import { ThemeToggle } from '../navigation/ThemeToggle';
import { NotificationDropdown } from '../navigation/NotificationDropdown';
import { ProfileDropdown } from '../navigation/ProfileDropdown';
import { GlobalSearchModal } from '../navigation/GlobalSearchModal';

export const Header = ({ onOpenMobileSidebar }) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-30 h-20 bg-white/75 dark:bg-[#0d131d]/85 backdrop-blur-xl border-b border-border/70 dark:border-border-dark/80 px-4 sm:px-8 flex items-center justify-between transition-all duration-300 shadow-sm">
        {/* Subtle top golden light reflection strip */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-accent/40 to-transparent pointer-events-none" />

        {/* Left Section: Mobile Hamburger & 3D Global Search */}
        <div className="flex items-center gap-4">
          <button
            onClick={onOpenMobileSidebar}
            className="lg:hidden p-2.5 rounded-xl text-charcoal-muted hover:text-accent hover:bg-ivory dark:hover:bg-primary-800/80 border border-transparent hover:border-accent/30 transition-all duration-200 active:scale-95"
            aria-label="Open mobile navigation"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* 3D Global Search Bar */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="group hidden sm:flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-white/80 dark:bg-primary-900/60 border border-border dark:border-border-dark hover:border-accent/60 dark:hover:border-accent/60 shadow-sm hover:shadow-gold text-charcoal-muted dark:text-gray-400 text-xs transition-all duration-300 w-72 md:w-88 hover:-translate-y-0.5 active:translate-y-0"
          >
            <div className="w-7 h-7 rounded-lg bg-accent/10 flex items-center justify-center text-accent group-hover:scale-110 group-hover:bg-accent/20 transition-all">
              <Search className="w-3.5 h-3.5" />
            </div>
            <span className="flex-1 text-left truncate text-charcoal/80 dark:text-gray-300 group-hover:text-primary dark:group-hover:text-white font-medium">
              Search suites, folios, VIP guests...
            </span>
            {/* 3D Embossed Keycap */}
            <kbd className="hidden md:inline-flex items-center px-2 py-1 text-[10px] font-mono font-semibold bg-ivory dark:bg-primary-800 border border-border dark:border-border-dark rounded-md text-charcoal-muted dark:text-gray-300 shadow-[0_2px_0_rgba(0,0,0,0.08)] dark:shadow-[0_2px_0_rgba(0,0,0,0.5)] group-hover:border-accent/40">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Right Section: 3D Status Pill, Controls & Profile */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Mobile Search trigger */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="sm:hidden p-2 rounded-xl text-charcoal-muted hover:text-accent hover:bg-ivory dark:hover:bg-primary-800 transition-colors"
            aria-label="Search"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Theme Toggle Button */}
          <div className="p-0.5 rounded-xl bg-ivory/60 dark:bg-primary-900/60 border border-border/80 dark:border-border-dark shadow-inner">
            <ThemeToggle />
          </div>

          {/* Notification Center */}
          <div className="p-0.5 rounded-xl bg-ivory/60 dark:bg-primary-900/60 border border-border/80 dark:border-border-dark shadow-inner">
            <NotificationDropdown />
          </div>

          <div className="h-6 w-px bg-border/80 dark:border-border-dark mx-1 hidden sm:block" />

          {/* 3D Profile Avatar Dropdown */}
          <ProfileDropdown />
        </div>
      </header>

      {/* Global Search Dialog */}
      <GlobalSearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};

export default Header;

