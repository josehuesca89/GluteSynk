// src/agent/AgentStatusPanel.tsx
//
// Internal-only view into the agent's state. Only renders when the URL
// has ?agent=1 — never shown to regular users. Useful for you / support
// staff to glance at error counts, active flags, and recent support
// triage without opening devtools.

import { useEffect, useState } from "react";
import { appAgent } from "./AppAgent";

export function AgentStatusPanel() {
  const [visible] = useState(() => {
    if (typeof window === "undefined") return false;
    const params = new URLSearchParams(window.location.search);
    return params.get("agent") === "1";
  });
  const [status, setStatus] = useState(appAgent.getStatus());

  useEffect(() => {
    if (!visible) return;
    const id = setInterval(() => setStatus(appAgent.getStatus()), 3000);
    return () => clearInterval(id);
  }, [visible]);

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[9999] w-80 max-h-[70vh] overflow-y-auto rounded-2xl bg-zinc-950/95 border border-white/10 text-white text-xs p-4 shadow-2xl backdrop-blur-md font-mono">
      <div className="flex items-center justify-between mb-3">
        <span className="font-black uppercase tracking-wider text-sky-400">Agent Status</span>
        <span className={`px-2 py-0.5 rounded-md ${status.initialized ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
          {status.initialized ? "running" : "not initialized"}
        </span>
      </div>

      <div className="space-y-3">
        <div>
          <div className="text-white/40 uppercase text-[10px] mb-1">Errors logged</div>
          <div>{status.errorCount}</div>
        </div>

        <div>
          <div className="text-white/40 uppercase text-[10px] mb-1">Feature flags</div>
          {Object.entries(status.flags).map(([key, value]) => (
            <div key={key} className="flex justify-between">
              <span className="text-white/70">{key}</span>
              <span className={value ? "text-green-400" : "text-white/30"}>{String(value)}</span>
            </div>
          ))}
        </div>

        <div>
          <div className="text-white/40 uppercase text-[10px] mb-1">
            Reminders ({status.reminders.length})
          </div>
          {status.reminders.map((r) => (
            <div key={r.id} className="text-white/70">
              {r.title} — {new Date(r.dueAt).toLocaleTimeString()}
            </div>
          ))}
        </div>

        <div>
          <div className="text-white/40 uppercase text-[10px] mb-1">Recent support triage</div>
          {status.recentSupportInteractions.length === 0 && (
            <div className="text-white/30">none yet</div>
          )}
          {status.recentSupportInteractions.map((s, i) => (
            <div key={i} className="mb-1 text-white/70">
              <span className="text-sky-400">{s.classification.category}</span>
              {s.classification.escalate ? <span className="text-red-400"> (escalated)</span> : null}
              {": "}
              {s.message.slice(0, 40)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
