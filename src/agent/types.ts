// src/agent/types.ts
// Shared types for the in-app operations/management agent.

export type Lang = "en" | "es";

export type SupportCategory =
  | "payments"
  | "meal"
  | "exercise"
  | "routine_change"
  | "technical"
  | "general";

export interface SupportClassification {
  category: SupportCategory;
  /** 0-1 heuristic confidence from keyword matching. Not a real ML score. */
  confidence: number;
  /** True when this should be handed to a human instead of auto-answered. */
  escalate: boolean;
  /** Why it was flagged for escalation, if it was. */
  escalationReason?: string;
}

export interface SupportReply {
  classification: SupportClassification;
  /** A canned, bilingual first-line reply. For anything nuanced, the app
   * should still forward the message to the real Ari chat backend (the
   * Cloudflare Worker) — this is a fast triage layer, not a replacement. */
  reply: string;
}

export interface AgentErrorRecord {
  id: string;
  message: string;
  stack?: string;
  context?: string;
  timestamp: number;
  handled: boolean;
}

export type FeatureFlagValue = boolean | string | number;

export interface FeatureFlagDefinition<T extends FeatureFlagValue = FeatureFlagValue> {
  key: string;
  default: T;
  description: string;
}

export interface EngagementReminder {
  id: string;
  title: string;
  body: string;
  dueAt: number;
  recurring?: "daily";
  sent?: boolean;
}

export interface RemoteSinkConfig {
  /** e.g. a Sentry DSN endpoint, a Firebase Crashlytics collector, or your
   * own Cloudflare Worker route. Left undefined = local-only logging. */
  errorEndpoint?: string;
  flagsEndpoint?: string;
}
