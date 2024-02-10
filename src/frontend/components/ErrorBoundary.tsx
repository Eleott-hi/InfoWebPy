// components/ErrorBoundary.tsx
"use client";
import React from 'react';

interface ErrorBoundaryProps {
    children: React.ReactNode;
}

interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { hasError: true, error };
    }

    render() {
        console.log("ErrorBoundary render", this.state);
        if (this.state.hasError || true) {
            return (
                <div className="error-dialog">
                    <h2>Something went wrong:</h2>
                    <p>{this.state.error?.message}</p>
                </div>
            );
        }
        return this.props.children;
    }
}

export default ErrorBoundary;
