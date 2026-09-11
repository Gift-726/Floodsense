# Known issues & status — v1.0-demo

Full-platform smoke test run 2026-09-11: dashboard load, all three scenario
switches (T-72/T-24/T-0), Dispatch Alert, USSD report submission, and the
report appearing live on the dashboard all pass with zero console errors,
verified across Chromium, Firefox, and WebKit engines.

## What's real vs. mocked

Everything below "Gift" scope is fully wired, tested cross-browser, and
mobile-responsive. Everything that depends on the **GIS Person** or **Data
Scientist**'s actual deliverables is still a clearly-labeled placeholder:

| Piece | Status |
|---|---|
| Kogi LGA boundaries | ✅ Real — sourced from geoBoundaries (CC BY 4.0) |
| LGA flood risk levels | ⚠️ Placeholder heuristic (`src/lib/mockRisk.ts`) — needs the Data Scientist's real LSTM output |
| Sensor node / community locations | ⚠️ Real town names, but approximate coordinates (`src/lib/kogiPlaces.ts`) — needs GIS Person's surveyed GPS pins |
| 72hr forecast curve, Lagdo proxy flag | ⚠️ Formula-driven mock (`src/app/api/forecast/route.ts`) — needs the trained LSTM + real classifier |
| Sensor readings | ⚠️ Deterministic per-scenario, does **not** drift over time — needs the Data Scientist's live Python simulator (Week 3 task) |
| Flood extent (2022) layer | ❌ Not built — no source data exists yet |
| Evacuation routes layer | ❌ Not built — no source data exists yet |
| Backtesting number (video centerpiece) | ❌ Not built — no trained model exists yet |

## Known limitations

- **Demo state is file-backed, not a real database.** Alert dispatch log and
  community reports persist to `.demo-state.json` (gitignored) so they survive
  Next.js dev-mode route recompilation. On Vercel's serverless functions this
  will reset between cold starts — fine for a single continuous filming
  session, not for a long-running production deployment.
- **Not deployed.** Needs a Vercel account connected to this repo — outside
  what I can do without your login.
- **Not tested on a physical Android/iOS device**, only emulated mobile
  viewports (390×844) across three browser engines. Roadmap Week 3 called for
  testing on an actual phone before filming.
- **Cross-browser tested via Playwright's Chromium/Firefox/WebKit engines**,
  not literal desktop Chrome/Firefox/Safari installs — same rendering
  engines, but if you have those browsers installed, a manual spot-check
  before filming is still worth the five minutes.

## Fixed during this pass

- Every panel now shows a real error state with a Retry button instead of
  hanging on "Loading…" forever if an API call fails.
- Initial page JS dropped from ~706KB to ~94KB by code-splitting Mapbox GL
  and Recharts into separate on-demand chunks (`next/dynamic`).
- WebKit/Safari-specific bug: the USSD simulator's community `<select>`
  rendered invisible white-on-white text — fixed with `[color-scheme:dark]`.
