// 📁 파일 경로: components/common/ErrorBoundary.tsx
"use client";

import { Component, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="flex flex-col items-center justify-center gap-4 p-8 text-center">
            <AlertTriangle className="h-12 w-12 text-[var(--color-danger)]" />
            <h2 className="text-xl font-semibold text-[var(--color-text-primary)]">
              오류가 발생했습니다
            </h2>
            <p className="text-[var(--color-text-secondary)]">
              {this.state.error?.message || "알 수 없는 오류가 발생했습니다."}
            </p>
            <Button
              onClick={() => this.setState({ hasError: false, error: null })}
            >
              다시 시도
            </Button>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
