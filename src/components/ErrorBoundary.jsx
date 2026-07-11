import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-brand-darker flex flex-col items-center justify-center p-6 text-white font-body">
          <div className="bg-brand-surface border border-red-500/30 p-8 rounded-2xl max-w-2xl w-full">
            <h2 className="text-3xl font-display text-red-500 mb-4">Something went wrong.</h2>
            <p className="text-brand-muted mb-6">The application crashed. Please refresh the page. If the problem persists, here are the error details:</p>
            <div className="bg-black/50 p-4 rounded-xl overflow-x-auto text-xs font-mono text-red-400">
              <p className="font-bold">{this.state.error && this.state.error.toString()}</p>
              <pre className="mt-2 text-white/50">{this.state.errorInfo && this.state.errorInfo.componentStack}</pre>
            </div>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-6 bg-brand-orange text-white px-6 py-3 rounded-xl font-bold uppercase tracking-wider hover:bg-orange-500 transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
