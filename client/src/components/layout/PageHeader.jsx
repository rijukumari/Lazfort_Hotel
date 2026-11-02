import React from 'react';
import { Breadcrumbs } from './Breadcrumbs';
import { Sparkles } from 'lucide-react';

export const PageHeader = ({
  title,
  description,
  subtitle,
  badge,
  actions,
}) => {
  const displayText = description || subtitle;

  return (
    <div className="relative pb-6 mb-8 border-b border-border/80 dark:border-white/10">
      {/* Subtle gold line accent */}
      <div className="absolute bottom-0 left-0 w-24 h-[2px] bg-gradient-to-r from-transparent via-accent/80 to-transparent" />

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
        <div className="space-y-1.5">
          <Breadcrumbs />
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-primary dark:text-white tracking-tight">
              {title}
            </h1>
            {badge && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-accent/15 text-accent border border-accent/40 shadow-sm">
                <Sparkles className="w-3 h-3 text-accent" />
                {badge}
              </span>
            )}
          </div>
          {displayText && (
            <p className="text-xs sm:text-sm text-charcoal-muted dark:text-gray-400 max-w-3xl leading-relaxed">
              {displayText}
            </p>
          )}
        </div>

        {actions && (
          <div className="flex items-center gap-3 shrink-0 whitespace-nowrap self-start md:self-auto">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
};

export default PageHeader;

