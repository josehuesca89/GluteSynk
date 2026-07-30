import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { appAgent } from './agent/AppAgent'
import { AgentErrorBoundary } from './agent/AgentErrorBoundary'
import { AgentStatusPanel } from './agent/AgentStatusPanel'

// Read the user's stored language preference directly (same key App.tsx
// uses via useLocalStorage) so error boundary text and reminders are in
// the right language from the very first paint.
function getStoredLang(): "en" | "es" {
  try {
    const raw = localStorage.getItem("glutesync_lang");
    return raw === '"es"' ? "es" : "en";
  } catch {
    return "en";
  }
}

const lang = getStoredLang();

appAgent.init({
  lang,
  // Point these at a real Sentry DSN endpoint / Crashlytics collector /
  // your own Worker route when you have one. Left undefined = local-only
  // logging, which is the safe default for now.
  errorEndpoint: undefined,
  flagsEndpoint: undefined,
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AgentErrorBoundary lang={lang}>
      <App />
      <AgentStatusPanel />
    </AgentErrorBoundary>
  </StrictMode>
);
