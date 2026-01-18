import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    [x: string]: any;
    public state: State = {
        hasError: false,
        error: null
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex flex-col items-center justify-center bg-bgPrimary text-textPrimary p-4">
                    <div className="max-w-md text-center bg-card p-8 rounded-2xl border border-border shadow-2xl">
                        <h1 className="text-2xl font-bold mb-4 text-error">Something went wrong.</h1>
                        <p className="mb-6 text-textSecondary text-sm">{this.state.error?.message}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="px-6 py-2 bg-accent text-bgPrimary font-bold rounded-xl hover:bg-accentHover transition-colors"
                        >
                            Reload Application
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
