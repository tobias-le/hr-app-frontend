import React, { Component, ErrorInfo } from "react";
import { useSnackbarStore } from "./GlobalSnackbar";

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
    const { showMessage } = useSnackbarStore.getState();
    showMessage(error.message || "An unexpected error occurred");
  }

  render() {
    if (this.state.hasError) {
      return null; // Or a fallback UI if you prefer
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
