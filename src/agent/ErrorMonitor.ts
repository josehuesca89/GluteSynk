// src/agent/ErrorMonitor.ts
//
// Honest scope: this module does real, useful things a client app can
// actually do —
//   1. Capture uncaught errors / unhandled promise rejections.
//   2. Keep a small local log (so you can see what happened even without
//      a backend wired up yet).
//   3. "Self-heal" in the ways that are real for a browser app: recover
//      from corrupted localStorage, retry flaky network calls with
//      backoff, and give React an error boundary to fall back to instead
//      of a blank white screen.
//   4. Forward to a real crash service (Sentry, Firebase Crashlytics, or
//      your own Worker) IF you configure an endpoint. Without one, it
//      just logs locally — it does not fabricate telemetry.
//
// What it does NOT do: rewrite application code, redeploy itself, or fix
// bugs without a human. No such capability exists.

import type { AgentErrorRecord, RemoteSinkConfig } from "./types";

const LOG_KEY = "glutesync_agent_error_log";
const MAX_LOG_ENTRIES = 50;

function safeParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

class ErrorMonitor {
  private sink: RemoteSinkConfig = {};
  private listeners: Array<(log: AgentErrorRecord[]) => void> = [];
  private installed = false;

  configure(sink: RemoteSinkConfig) {
    this.sink = { ...this.sink, ...sink };
  }

  /** Wire up global handlers. Call once, at app startup. */
  install() {
    if (this.installed || typeof window === "undefined") return;
    this.installed = true;

    window.addEventListener("error", (event) => {
      this.report(event.message, event.error?.stack, "window.onerror");
    });

    window.addEventListener("unhandledrejection", (event) => {
      const reason = event.reason;
      const message =
        reason instanceof Error ? reason.message : String(reason);
      this.report(message, reason instanceof Error ? reason.stack : undefined, "unhandledrejection");
    });
  }

  report(message: string, stack?: string, context?: string) {
    const record: AgentErrorRecord = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      message,
      stack,
      context,
      timestamp: Date.now(),
      handled: true,
    };

    const log = this.getLog();
    log.unshift(record);
    if (log.length > MAX_LOG_ENTRIES) log.length = MAX_LOG_ENTRIES;
    localStorage.setItem(LOG_KEY, JSON.stringify(log));
    this.listeners.forEach((fn) => fn(log));

    if (this.sink.errorEndpoint) {
      // Best-effort forward. Never throw if this fails — a broken crash
      // reporter should never itself crash the app.
      fetch(this.sink.errorEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(record),
        keepalive: true,
      }).catch(() => {
        /* offline or endpoint down — already logged locally, fine */
      });
    }
  }

  getLog(): AgentErrorRecord[] {
    return safeParse<AgentErrorRecord[]>(localStorage.getItem(LOG_KEY), []);
  }

  clearLog() {
    localStorage.removeItem(LOG_KEY);
    this.listeners.forEach((fn) => fn([]));
  }

  subscribe(fn: (log: AgentErrorRecord[]) => void) {
    this.listeners.push(fn);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== fn);
    };
  }

  /**
   * Self-healing #1: a localStorage read that returns corrupted JSON
   * (rare, but happens after failed writes, extensions tampering with
   * storage, or manual editing) is caught, logged, and reset to a safe
   * default instead of crashing the whole app on mount.
   */
  readLocalStorageWithRecovery<T>(key: string, fallback: T): T {
    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;
    try {
      return JSON.parse(raw) as T;
    } catch (err) {
      this.report(
        `Corrupted localStorage key "${key}" — reset to default`,
        err instanceof Error ? err.stack : undefined,
        "storage-recovery"
      );
      localStorage.setItem(key, JSON.stringify(fallback));
      return fallback;
    }
  }

  /**
   * Self-healing #2: retry a flaky async operation (e.g. a fetch to the
   * Ari worker) with exponential backoff before giving up.
   */
  async retry<T>(
    fn: () => Promise<T>,
    { attempts = 3, baseDelayMs = 400, context }: { attempts?: number; baseDelayMs?: number; context?: string } = {}
  ): Promise<T> {
    let lastError: unknown;
    for (let i = 0; i < attempts; i++) {
      try {
        return await fn();
      } catch (err) {
        lastError = err;
        if (i < attempts - 1) {
          await new Promise((r) => setTimeout(r, baseDelayMs * 2 ** i));
        }
      }
    }
    this.report(
      lastError instanceof Error ? lastError.message : String(lastError),
      lastError instanceof Error ? lastError.stack : undefined,
      context ?? "retry-exhausted"
    );
    throw lastError;
  }
}

export const errorMonitor = new ErrorMonitor();
