import React from "react";
import styles from "./ErrorBoundary.module.css";

/**
 * Standard React Error Boundary component for catching client-side crashes.
 * Prevents full app crash by displaying a fallback UI.
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to an error reporting service if needed
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className={styles.errorContainer}>
          <div className={styles.errorCard}>
            <h2 className={styles.errorTitle}>Something went wrong</h2>
            <p className={styles.errorMessage}>
              The UI failed to load due to malformed data or a rendering error.
            </p>
            {process.env.NODE_ENV === "development" && (
              <pre className={styles.errorDetails}>
                {this.state.error?.toString()}
              </pre>
            )}
            <button
              className={styles.retryButton}
              onClick={() => this.setState({ hasError: false })}
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
