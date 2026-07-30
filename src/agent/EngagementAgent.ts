// src/agent/EngagementAgent.ts
//
// Honest scope: real browser Notification API, scheduled client-side.
// This works while the tab/app is open (or briefly in background on most
// desktop browsers). It is NOT push notifications — true push (that wakes
// the app from fully closed) needs a Service Worker + VAPID keys + a
// backend that can push at arbitrary times, which is a real project on
// its own. This module is the honest, working version of "reminders",
// and is structured so it's a small step to upgrade later.

import type { EngagementReminder } from "./types";

const REMINDER_KEY = "glutesync_agent_reminders";
const CHECK_INTERVAL_MS = 60_000;

function loadReminders(): EngagementReminder[] {
  try {
    return JSON.parse(localStorage.getItem(REMINDER_KEY) ?? "[]");
  } catch {
    return [];
  }
}

function saveReminders(reminders: EngagementReminder[]) {
  localStorage.setItem(REMINDER_KEY, JSON.stringify(reminders));
}

class EngagementAgent {
  private timer: ReturnType<typeof setInterval> | null = null;

  async requestPermission(): Promise<NotificationPermission> {
    if (typeof Notification === "undefined") return "denied";
    if (Notification.permission === "default") {
      return Notification.requestPermission();
    }
    return Notification.permission;
  }

  schedule(reminder: Omit<EngagementReminder, "id" | "sent">): string {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const reminders = loadReminders();
    reminders.push({ ...reminder, id, sent: false });
    saveReminders(reminders);
    return id;
  }

  cancel(id: string) {
    saveReminders(loadReminders().filter((r) => r.id !== id));
  }

  list(): EngagementReminder[] {
    return loadReminders();
  }

  /** Call once at startup. Checks due reminders every minute while the app is open. */
  start() {
    if (this.timer) return;
    this.timer = setInterval(() => this.checkDue(), CHECK_INTERVAL_MS);
    // Also check immediately on start.
    this.checkDue();
  }

  stop() {
    if (this.timer) clearInterval(this.timer);
    this.timer = null;
  }

  private checkDue() {
    if (typeof Notification === "undefined" || Notification.permission !== "granted") return;
    const reminders = loadReminders();
    const now = Date.now();
    let changed = false;

    for (const reminder of reminders) {
      if (reminder.sent && reminder.recurring !== "daily") continue;
      if (reminder.dueAt > now) continue;

      new Notification(reminder.title, { body: reminder.body });
      changed = true;

      if (reminder.recurring === "daily") {
        reminder.dueAt = now + 24 * 60 * 60 * 1000;
        reminder.sent = false;
      } else {
        reminder.sent = true;
      }
    }

    if (changed) saveReminders(reminders);
  }

  /** Convenience: nudge the user if they haven't logged a workout today by the given hour. */
  scheduleDailyWorkoutReminder(hour = 18, lang: "en" | "es" = "en") {
    const now = new Date();
    const due = new Date(now);
    due.setHours(hour, 0, 0, 0);
    if (due.getTime() < now.getTime()) due.setDate(due.getDate() + 1);

    return this.schedule({
      title: lang === "es" ? "Glute Sync" : "Glute Sync",
      body:
        lang === "es"
          ? "¿Ya entrenaste hoy? Unos minutos cuentan."
          : "Haven't trained yet today? A few minutes still counts.",
      dueAt: due.getTime(),
      recurring: "daily",
    });
  }
}

export const engagementAgent = new EngagementAgent();
