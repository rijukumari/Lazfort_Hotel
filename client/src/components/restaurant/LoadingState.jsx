import React from 'react';
import { Sparkles } from 'lucide-react';

export const LoadingState = ({ message = 'Synchronizing gastronomy registry...' }) => {
  return (
    <div className="py-16 text-center space-y-3">
      <div className="w-10 h-10 rounded-2xl bg-accent/20 border border-accent/40 text-accent flex items-center justify-center mx-auto animate-pulse shadow-gold">
        <Sparkles className="w-5 h-5 text-accent animate-spin" />
      </div>
      <p className="text-xs font-mono text-accent">{message}</p>
    </div>
  );
};

export default LoadingState;

