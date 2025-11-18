'use client';

import React, { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="flex items-center justify-center min-h-screen">
            <Card className="w-full max-w-md">
              <CardContent className="py-12">
                <div className="text-center space-y-4">
                  <div className="text-5xl mb-4">⚠️</div>
                  <h2 className="text-xl font-bold">Something went wrong</h2>
                  <p className="text-sm text-muted-foreground">
                    {this.state.error?.message || 'An unexpected error occurred'}
                  </p>
                  <Button onClick={this.handleReset} className="w-full">
                    Try Again
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
