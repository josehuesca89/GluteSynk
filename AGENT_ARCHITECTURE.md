# GluteSync — Agent Module & Build Notes

## What changed and why

### Build fixes
- `node_modules` was committed to git (9,273 files) with no `.gitignore`. That
  bundled platform-specific native binaries (Rollup's Linux vs. Mac build)
  into the repo, so cloning it on a different OS broke the build immediately.
  Fixed: untracked `node_modules`, added `.gitignore`.
- `postcss.config.js` used Tailwind v3-style config while `vite.config.ts`
  already used the v4 `@tailwindcss/vite` plugin — running both broke the
  build. Fixed: removed the redundant PostCSS config (and the unused v3
  `tailwind.config.cjs`, since v4 doesn't need it).
- Real functional bug: the "Meals & Diet" / "Recovery" filter buttons on the
  library screen didn't filter anything, because `Gallery.tsx` expected prop
  values (`routines`/`meals`/`guides`) that `App.tsx` never actually sent
  (`workout`/`meal`/`stretch`). Fixed by aligning the types.
- Missing `Activity` icon import, missing `tailwind-merge` dependency, an
  untyped `.js` hook, and a non-functional `lint` script (eslint wasn't even
  installed) were all fixed.

### ESLint
Real flat config (`eslint.config.js`) using ESLint 10 + `typescript-eslint`
+ `eslint-plugin-react-hooks`. Running it surfaced two genuine React
anti-patterns (`setState` called synchronously inside `useEffect`, which can
cause double-renders) in `App.tsx`'s rest timer and `Gallery.tsx`'s filter
sync — both fixed with the React-recommended pattern (derive/replace state
correctly instead of mirroring a prop through an effect).

### CI
`.github/workflows/main.yml` (GitHub Pages deploy) now runs `npm install`
(no longer needs `--legacy-peer-deps`), `npm run lint`, `npx tsc --noEmit`,
and `npm run build` — so a broken push fails the build instead of silently
deploying broken code.

## The agent module (`src/agent/`)

This is a real, working "operations" layer for the app — scoped to what's
honestly achievable as client-side code. It is **not** a fully autonomous,
self-modifying AI system; nothing like that exists. Here's what each piece
actually does:

| File | Real capability |
|---|---|
| `ErrorMonitor.ts` | Captures uncaught errors and unhandled promise rejections, keeps a local rolling log (`localStorage`), recovers automatically from corrupted `localStorage` values, retries flaky network calls with backoff, and can forward to a real crash service if you configure `errorEndpoint`. |
| `AgentErrorBoundary.tsx` | A React error boundary — if any component crashes, the user sees a bilingual recovery screen with a retry button instead of a blank page. |
| `FeatureFlags.ts` | Flag resolution: local override → remote value (if `flagsEndpoint` is configured) → hardcoded default. Lets you kill a broken feature without a redeploy, once a remote endpoint exists. |
| `SupportRouter.ts` | Bilingual (EN/ES) keyword-based classifier for payments / meal / exercise / routine-change / technical / general. Billing disputes, refunds, chargebacks, and legal mentions are **always** routed to a human — never auto-answered. Everything else still gets the real Ari response from your Cloudflare Worker; this just triages first. |
| `EngagementAgent.ts` | Real browser `Notification` API reminders (e.g. a daily "haven't trained yet?" nudge) while the app is open. This is not push notification infrastructure — true push (waking the app from fully closed) needs a Service Worker + VAPID keys + a backend, which doesn't exist yet. |
| `ContentAgent.ts` | A documented stub + client for calling a `/generate-copy` route you'd add to your Worker, which would call the Claude API server-side (your API key never belongs in the browser bundle). There is no "ingests market data and generates publication-ready designs" pipeline running today — that's a separate backend project. |
| `AppAgent.ts` | The orchestrator. `appAgent.init()` wires everything up at startup (see `main.tsx`). |
| `AgentStatusPanel.tsx` | A debug view of agent state, only visible at `yoursite.com/?agent=1` — never shown to regular users. |

## What would be needed to make this fully real in production

- **Crash reporting**: sign up for Sentry or Firebase Crashlytics, get a
  DSN/collector URL, pass it to `appAgent.init({ errorEndpoint })`.
- **Feature flags backend**: a small JSON route on your existing Worker
  (`GET /flags` returning `{ "flag_key": true }`) — pass its URL as
  `flagsEndpoint`.
- **Marketing/content generation**: add a `/generate-copy` POST route to
  your Worker that calls the Claude API with your Anthropic key stored as a
  Worker secret (never client-side).
- **Real payments**: integrate Stripe (or similar) — never handle card data
  or secrets in this React app directly.
- **True push notifications**: add a Service Worker + Web Push (VAPID keys)
  and a small backend to trigger sends at arbitrary times.

None of the above requires rewriting what's already built — `AppAgent`'s
config object is exactly the seam where real credentials plug in.
