import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { RotateCcw } from 'lucide-react';
import { Button } from '../ui/Button';

interface Props {
  children: ReactNode;
}

interface State {
  error: Error | null;
}

/**
 * Without this, any render-time throw took the whole app down to a blank white
 * page with nothing but a console message.
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Replace with a real error-reporting sink (Sentry et al) when one exists.
    console.error('Unhandled render error:', error, info.componentStack);
  }

  render() {
    const { error } = this.state;
    if (!error) return this.props.children;

    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-6 py-20 bg-canvas">
        <h1 className="text-display-sm text-ink mb-4">Something broke on our end</h1>
        <p className="text-ink-muted max-w-md text-pretty mb-8">
          This page hit an unexpected error. Reloading usually clears it — if it keeps happening,
          please get in touch.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button onClick={() => window.location.reload()}>
            <RotateCcw className="w-4 h-4" aria-hidden="true" />
            Reload page
          </Button>
          <Button variant="outline" href="/">
            Back to home
          </Button>
        </div>

        {import.meta.env.DEV && (
          <pre className="mt-10 max-w-2xl overflow-auto text-left text-xs text-danger bg-danger-soft border border-danger/20 rounded-xl p-4">
            {error.stack ?? error.message}
          </pre>
        )}
      </div>
    );
  }
}
