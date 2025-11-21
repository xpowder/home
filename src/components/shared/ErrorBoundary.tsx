"use client";
import { Component, ReactNode } from "react";
import { toast } from "sonner";

import { logger } from "@/lib/logger"; // optional

import ErrorPage from "./ErrorPage";

interface Props {
  children: ReactNode;
  fallback?: ReactNode; // optional custom fallback
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error) {
    // Log error (console + optional backend service)
    logger.error(error, "Component error caught in ErrorBoundary");
    toast.error("Something went wrong in this section!");
  }

  resetError = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      return <ErrorPage onRetry={this.resetError} />;
    }

    return this.props.children;
  }
}
