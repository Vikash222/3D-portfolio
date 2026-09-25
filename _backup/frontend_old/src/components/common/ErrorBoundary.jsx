import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#030712] text-slate-100 flex items-center justify-center p-4 selection:bg-cyan-500 selection:text-black">
          <div className="max-w-md w-full p-8 rounded-3xl bg-slate-900/90 border border-white/15 shadow-2xl text-center backdrop-blur-xl">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center mx-auto mb-5 shadow-lg shadow-amber-500/10">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight mb-2">
              Application Notice
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm mb-6 leading-relaxed">
              We encountered a temporary state issue. Click below to reload cleanly.
            </p>

            {this.state.error?.message && (
              <div className="mb-6 p-3 rounded-xl bg-black/40 border border-white/10 text-left">
                <p className="text-[11px] font-mono text-cyan-300 line-clamp-3">
                  {this.state.error.message}
                </p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={this.handleReload}
                className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Reload Page</span>
              </button>
              <button
                onClick={this.handleReset}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-white/10 hover:bg-white/10 text-slate-300 font-semibold text-xs transition-all cursor-pointer"
              >
                <Home className="w-4 h-4 text-cyan-400" />
                <span>Return Home</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
