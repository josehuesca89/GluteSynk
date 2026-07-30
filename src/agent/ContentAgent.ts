// src/agent/ContentAgent.ts
//
// This is intentionally a thin client + a design note, not a working
// "generates publication-ready designs from market data" pipeline —
// that doesn't exist as honest client-side code, and building a fake
// version would be worse than not building one.
//
// The right architecture:
//   Browser (this file)  --POST-->  Your Worker  --calls-->  Claude API
//                                        |
//                                        +--> reads market data from
//                                             wherever you actually get
//                                             it (analytics export, ad
//                                             platform API, a CSV you
//                                             upload) — none of that
//                                             exists yet either, and
//                                             would need real credentials
//                                             for whatever source you pick.
//
// Your API key NEVER belongs in this file or anywhere in the built
// bundle — it must live in the Worker's environment secrets.
//
// Below is a working client for a route you'd add to your existing
// Worker (https://muddy-water-57d2.josehuesca89.workers.dev/generate-copy,
// for example). Until that route exists, calls will fail — that's
// expected and by design, not a bug.

const CONTENT_ENDPOINT = "https://muddy-water-57d2.josehuesca89.workers.dev/generate-copy";

export interface CopyBriefRequest {
  brief: string;
  lang: "en" | "es";
  tone?: "energetic" | "reassuring" | "direct";
  channel?: "instagram" | "email" | "sms" | "in_app";
}

export interface CopyBriefResponse {
  headline: string;
  body: string;
  cta: string;
}

export async function requestMarketingCopy(req: CopyBriefRequest): Promise<CopyBriefResponse> {
  const res = await fetch(CONTENT_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(req),
  });
  if (!res.ok) {
    throw new Error(
      `Content agent endpoint not available yet (${res.status}). Add a /generate-copy route to your Worker that calls the Claude API server-side.`
    );
  }
  return res.json();
}
