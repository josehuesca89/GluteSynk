// src/agent/FeatureFlags.ts
//
// A real, working feature flag manager. Flags resolve in this order:
//   1. Local override (set via setOverride — useful for QA/testing on a
//      device, persisted in localStorage)
//   2. Remote value (fetched once at startup from `flagsEndpoint`, if
//      you configure one — e.g. a small JSON route on your Cloudflare
//      Worker)
//   3. Hardcoded default below
//
// This lets you ship a feature dark, flip it on for everyone without a
// redeploy (once you wire a remote endpoint), or kill a broken feature
// instantly.

import type { FeatureFlagDefinition, FeatureFlagValue, RemoteSinkConfig } from "./types";

const OVERRIDE_KEY = "glutesync_agent_flag_overrides";

export const FLAG_DEFINITIONS: FeatureFlagDefinition[] = [
  { key: "voice_assistant_es", default: true, description: "Enable Spanish voice assistant responses" },
  { key: "engagement_reminders", default: true, description: "Enable local workout/streak reminder notifications" },
  { key: "support_router", default: true, description: "Enable the bilingual support triage layer before falling back to the Ari worker chat" },
  { key: "agent_status_panel", default: false, description: "Show the internal agent status/debug panel (?agent=1)" },
];

type Listener = (flags: Record<string, FeatureFlagValue>) => void;

class FeatureFlagManager {
  private remoteValues: Record<string, FeatureFlagValue> = {};
  private listeners: Listener[] = [];
  private sink: RemoteSinkConfig = {};

  configure(sink: RemoteSinkConfig) {
    this.sink = { ...this.sink, ...sink };
  }

  private getOverrides(): Record<string, FeatureFlagValue> {
    try {
      return JSON.parse(localStorage.getItem(OVERRIDE_KEY) ?? "{}");
    } catch {
      return {};
    }
  }

  /** Call once at startup. Best-effort — falls back to defaults if it fails or isn't configured. */
  async loadRemote() {
    if (!this.sink.flagsEndpoint) return;
    try {
      const res = await fetch(this.sink.flagsEndpoint);
      if (res.ok) {
        this.remoteValues = await res.json();
        this.notify();
      }
    } catch {
      // No remote config reachable — defaults still apply. Not fatal.
    }
  }

  get<T extends FeatureFlagValue>(key: string): T {
    const def = FLAG_DEFINITIONS.find((f) => f.key === key);
    const overrides = this.getOverrides();
    if (key in overrides) return overrides[key] as T;
    if (key in this.remoteValues) return this.remoteValues[key] as T;
    return (def?.default ?? false) as T;
  }

  getAll(): Record<string, FeatureFlagValue> {
    const overrides = this.getOverrides();
    const result: Record<string, FeatureFlagValue> = {};
    for (const def of FLAG_DEFINITIONS) {
      result[def.key] = overrides[def.key] ?? this.remoteValues[def.key] ?? def.default;
    }
    return result;
  }

  setOverride(key: string, value: FeatureFlagValue) {
    const overrides = this.getOverrides();
    overrides[key] = value;
    localStorage.setItem(OVERRIDE_KEY, JSON.stringify(overrides));
    this.notify();
  }

  clearOverride(key: string) {
    const overrides = this.getOverrides();
    delete overrides[key];
    localStorage.setItem(OVERRIDE_KEY, JSON.stringify(overrides));
    this.notify();
  }

  subscribe(fn: Listener) {
    this.listeners.push(fn);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== fn);
    };
  }

  private notify() {
    const all = this.getAll();
    this.listeners.forEach((fn) => fn(all));
  }
}

export const featureFlags = new FeatureFlagManager();
