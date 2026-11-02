import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

const ToastContext = createContext(undefined);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback(id => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const showToast = useCallback((
    title,
    message = '',
    type = 'success',
    duration = 4000
  ) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newToast = { id, title, message, type, duration };

    setToasts(prev => [...prev, newToast]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ toasts, showToast, removeToast }}>
      {children}
      {/* Toast Render Container */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col space-y-2.5 max-w-sm w-full pointer-events-none">
        {toasts.map(t => (
          <div
            key={t.id}
            className={`pointer-events-auto flex items-start p-4 rounded-xl border shadow-xl backdrop-blur-md transition-all duration-300 animate-in slide-in-from-bottom-5 ${
              t.type === 'success'
                ? 'bg-white/95 dark:bg-[#151D28]/95 border-emerald-500/40 text-emerald-950 dark:text-emerald-200'
                : t.type === 'error'
                ? 'bg-white/95 dark:bg-[#151D28]/95 border-rose-500/40 text-rose-950 dark:text-rose-200'
                : t.type === 'warning'
                ? 'bg-white/95 dark:bg-[#151D28]/95 border-amber-500/40 text-amber-950 dark:text-amber-200'
                : 'bg-white/95 dark:bg-[#151D28]/95 border-accent/40 text-charcoal dark:text-gray-200'
            }`}
          >
            <div className="flex-shrink-0 mr-3 mt-0.5">
              {t.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />}
              {t.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400" />}
              {t.type === 'warning' && <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />}
              {t.type === 'info' && <Info className="w-5 h-5 text-accent" />}
            </div>
            <div className="flex-1 min-w-0 pr-2">
              <p className="text-sm font-semibold text-charcoal dark:text-white leading-tight">{t.title}</p>
              {t.message && (
                <p className="text-xs text-charcoal-muted dark:text-gray-400 mt-1 leading-snug">
                  {t.message}
                </p>
              )}
            </div>
            <button
              onClick={() => removeToast(t.id)}
              className="text-gray-400 hover:text-charcoal dark:hover:text-white transition-colors cursor-pointer"
              aria-label="Close notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export default ToastProvider;

