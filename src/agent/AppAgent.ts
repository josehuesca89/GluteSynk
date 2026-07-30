// src/agent/AppAgent.ts
//
// Single entry point for the app's operations/management layer. Import
// `appAgent` and call `appAgent.init()` once at startup (see main.tsx).
//
// This class is real and functional for what a browser app can honestly
// do: crash capture + local recovery, feature flags, a bilingual support
// triage layer, and local engagement reminders. It is deliberately NOT
// marketed here as "fully autonomous" — every remote integration point
// (crash sink, flags backend, content generation) is a documented stub
// until you plug in real credentials on your backend.

import { errorMonitor } from "./ErrorMonitor";
import { featureFlags, FLAG_DEFINITIONS } from "./FeatureFlags";
import { engagementAgent } from "./EngagementAgent";
import { route, logSupportInteraction, getSupportLog } from "./SupportRouter";
import type { Lang, RemoteSinkConfig, SupportReply } from "./types";

interface AppAgentConfig extends RemoteSinkConfig {
  lang?: Lang;
  enableReminders?: boolean;
}

class AppAgent {
  private initialized = false;
  lang: Lang = "en";

  async init(config: AppAgentConfig = {}) {
    if (this.initialized) return;
    this.initialized = true;
    this.lang = config.lang ?? "en";

    errorMonitor.configure({
      errorEndpoint: config.errorEndpoint,
    });
    errorMonitor.install();

    featureFlags.configure({ flagsEndpoint: config.flagsEndpoint });
    await featureFlags.loadRemote();

    if (featureFlags.get<boolean>("engagement_reminders") && config.enableReminders !== false) {
      engagementAgent.start();
    }
  }

  // --- Errors / self-healing -------------------------------------------
  readLocalStorage<T>(key: string, fallback: T): T {
    return errorMonitor.readLocalStorageWithRecovery(key, fallback);
  }

  retry<T>(fn: () => Promise<T>, opts?: { attempts?: number; baseDelayMs?: number; context?: string }) {
    return errorMonitor.retry(fn, opts);
  }

  getErrorLog() {
    return errorMonitor.getLog();
  }

  // --- Feature flags -----------------------------------------------------
  isEnabled(flagKey: string): boolean {
    return Boolean(featureFlags.get(flagKey));
  }

  get flagDefinitions() {
    return FLAG_DEFINITIONS;
  }

  // --- Support routing ----------------------------------------------------
  handleSupportMessage(message: string, lang: Lang = this.lang): SupportReply {
    if (!this.isEnabled("support_router")) {
      return { classification: { category: "general", confidence: 0, escalate: false }, reply: "" };
    }
    const result = route(message, lang);
    logSupportInteraction(message, result);
    return result;
  }

  getSupportLog() {
    return getSupportLog();
  }

  // --- Engagement ----------------------------------------------------------
  async enableReminders(lang: Lang = this.lang) {
    const permission = await engagementAgent.requestPermission();
    if (permission === "granted") {
      engagementAgent.scheduleDailyWorkoutReminder(18, lang);
    }
    return permission;
  }

  // --- Status snapshot, useful for the debug panel or a support dashboard --
  getStatus() {
    return {
      initialized: this.initialized,
      lang: this.lang,
      errorCount: errorMonitor.getLog().length,
      flags: featureFlags.getAll(),
      reminders: engagementAgent.list(),
      recentSupportInteractions: getSupportLog().slice(0, 5),
    };
  }
}

export const appAgent = new AppAgent();
