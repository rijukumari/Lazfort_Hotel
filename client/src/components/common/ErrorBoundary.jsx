import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Lazfort ERP Captured Error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReload = () => {
    window.location.reload();
  };

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.href = '/super-admin/dashboard';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-ivory dark:bg-[#0b0f17] flex items-center justify-center p-6 text-charcoal dark:text-gray-100">
          <div className="max-w-xl w-full bg-white dark:bg-primary-900/90 border border-accent/40 rounded-3xl p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden text-center space-y-6">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-accent to-transparent" />
            
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-500 mx-auto flex items-center justify-center shadow-lg shadow-amber-500/10">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-primary dark:text-white">
                Console View Synchronized
              </h1>
              <p className="text-xs sm:text-sm text-charcoal-muted dark:text-gray-400">
                A component encounter was intercepted. You can safely reload the luxury console or navigate back to the primary operational dashboard.
              </p>
            </div>

            {this.state.error && (
              <div className="p-4 rounded-2xl bg-primary-950/50 border border-white/10 text-left text-[11px] font-mono text-rose-400 max-h-40 overflow-auto">
                <p className="font-bold">{this.state.error.toString()}</p>
                {this.state.errorInfo?.componentStack && (
                  <pre className="mt-2 text-[10px] text-gray-400 whitespace-pre-wrap">
                    {this.state.errorInfo.componentStack.slice(0, 300)}...
                  </pre>
                )}
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={this.handleReload}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-2xl gold-gradient-bg text-primary-950 font-bold text-xs uppercase tracking-wider btn-3d shadow-gold"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Reload Page</span>
              </button>
              <button
                type="button"
                onClick={this.handleReset}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-2xl border border-border dark:border-white/15 bg-white/40 dark:bg-white/5 text-charcoal dark:text-gray-200 font-semibold text-xs hover:border-accent transition-colors"
              >
                <Home className="w-4 h-4 text-accent" />
                <span>Return to Dashboard</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

