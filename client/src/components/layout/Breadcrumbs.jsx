import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Breadcrumbs = () => {
  const location = useLocation();
  const { role = 'hotel_admin' } = useAuth();

  const pathnames = location.pathname.split('/').filter(Boolean);

  const formatSegment = str => {
    return str
      .replace(/-/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <nav aria-label="Breadcrumb" className="flex items-center text-xs text-charcoal-muted dark:text-gray-400 mb-2">
      <Link
        to={`/${role.replace(/_/g, '-')}/dashboard`}
        className="flex items-center gap-1 hover:text-accent transition-colors"
      >
        <Home className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Home</span>
      </Link>

      {pathnames.map((segment, index) => {
        const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;

        return (
          <React.Fragment key={routeTo}>
            <ChevronRight className="w-3 h-3 mx-1.5 text-gray-400" />
            {isLast ? (
              <span className="text-primary dark:text-white font-semibold capitalize">
                {formatSegment(segment)}
              </span>
            ) : (
              <Link
                to={routeTo}
                className="hover:text-accent transition-colors capitalize"
              >
                {formatSegment(segment)}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

export default Breadcrumbs;

