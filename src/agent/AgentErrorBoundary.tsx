// src/agent/AgentErrorBoundary.tsx
import { Component, type ReactNode } from "react";
import { errorMonitor } from "./ErrorMonitor";

interface Props {
  children: ReactNode;
  lang?: "en" | "es";
}

interface State {
  hasError: boolean;
}

/**
 * Real self-healing behavior #3: catch render-time crashes anywhere in the
 * tree below this boundary, log them, and show a bilingual recovery screen
 * with a reset button instead of a blank white page. This is what "self
 * healing" honestly means in a browser app — graceful degradation, not
 * autonomous code repair.
 */
export class AgentErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: { componentStack: string }) {
    errorMonitor.report(error.message, error.stack, `react-boundary:${info.componentStack.slice(0, 200)}`);
  }

  handleReset = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    const lang = this.props.lang ?? "en";
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white p-6">
        <div className="max-w-md text-center space-y-4">
          <h1 className="text-2xl font-black uppercase tracking-tight">
            {lang === "es" ? "Algo salió mal" : "Something went wrong"}
          </h1>
          <p className="text-white/70">
            {lang === "es"
              ? "La aplicación tuvo un problema inesperado. Ya se registró para revisión. Puedes intentar continuar."
              : "The app hit an unexpected problem and it's been logged for review. You can try to continue."}
          </p>
          <button
            onClick={this.handleReset}
            className="px-6 py-3 rounded-2xl bg-sky-400 text-black font-black uppercase tracking-wider"
          >
            {lang === "es" ? "Intentar de nuevo" : "Try again"}
          </button>
        </div>
      </div>
    );
  }
}
