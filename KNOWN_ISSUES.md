# Known issues & status

**2026-10-02 update: the Data Scientist's real model handoff is now integrated.**
`/api/forecast` and `/api/sensors` serve real files (`src/data/model/`), not mocks. The
previous "backtesting number is missing" gap is resolved — honestly: the specific 2022 event
backtest the roadmap wanted is `NOT_COMPUTABLE` per the handoff, but real validation metrics
exist and are strong (see below). Full re-test after integration: dashboard load, all three
horizon tabs (T+1/T+7/T+30), Dispatch Alert, USSD report submission, and the report appearing
live on the dashboard all pass with zero console errors.

## What's real vs. placeholder, as of this integration

| Piece | Status |
|---|---|
| Kogi LGA boundaries | ✅ Real — sourced from geoBoundaries (CC BY 4.0) |
| Discharge forecast (7 horizons, GREEN/YELLOW/RED) | ✅ **Real** — Data Scientist's trained model, `src/data/model/forecast.json` |
| Sensor discharge/water-level readings | ✅ **Real** — Data Scientist's model-driven simulator, `src/data/model/sensor_readings.json` (single snapshot, not a running process) |
| Validation metrics (precision/recall/skill-vs-persistence) | ✅ **Real** — `docs/daily_flood_detection_metrics.csv`, `docs/rolling_origin_summary.csv` |
| LGA flood risk levels per community | ⚠️ Geography-based heuristic (`src/lib/mockRisk.ts`), bumped by the real `warning_state` — intentional per the handoff's own architecture (model forecasts discharge at one point; per-LGA severity is explicitly the software layer's job, not the model's) |
| Sensor node / community locations | ⚠️ Real town names, approximate coordinates (`src/lib/kogiPlaces.ts`) — the real sensor file carries no location metadata at all |
| Flood extent (2022) layer | ❌ Not built — no source data exists yet (GIS Person) |
| Evacuation routes layer | ❌ Not built — no source data exists yet (GIS Person) |
| "Flagged Critical X hours before peak flooding" claim | ❌ **Cannot be made** — independent 2022 GRDC event backtest is explicitly `NOT_COMPUTABLE` (missing real observations). Use instead: "100% recall, zero missed critical days at the 7-day horizon in 2022–2023 validation" (real, defensible, in `docs/daily_flood_detection_metrics.csv`) |

## Known limitations

- **Demo state is file-backed, not a real database.** Alert dispatch log and
  community reports persist to `.demo-state.json` (gitignored) so they survive
  Next.js dev-mode route recompilation. On Vercel's serverless functions this
  will reset between cold starts — fine for a single continuous filming
  session, not for a long-running production deployment.
- **The real forecast/sensor data are static snapshots**, not live-updating
  processes. Re-drop a refreshed `forecast.json` / `sensor_readings.json`
  (same schema, `src/data/model/`) to pick up new model output — no code
  change needed, since both API routes are forced dynamic (`export const
  dynamic = "force-dynamic"`) and read the file fresh on every request.
- **Right now the real model shows a calm day** (forecast origin 2025-12-31,
  mostly GREEN, one YELLOW at T+14). That's honestly what the model says —
  there's no dramatic "flood escalating" state to show live unless the Data
  Scientist provides a forecast snapshot from an actual high-risk period.
- **Not deployed.** Needs a Vercel account connected to this repo — outside
  what I can do without your login.
- **Not tested on a physical Android/iOS device**, only emulated mobile
  viewports (390×844) across three browser engines.
- **Cross-browser tested via Playwright's Chromium/Firefox/WebKit engines**,
  not literal desktop Chrome/Firefox/Safari installs — same rendering
  engines, but if you have those browsers installed, a manual spot-check
  before filming is still worth the five minutes.

## Fixed during the Week 4 polish pass

- Every panel now shows a real error state with a Retry button instead of
  hanging on "Loading…" forever if an API call fails.
- Initial page JS dropped from ~706KB to ~94KB by code-splitting Mapbox GL
  and Recharts into separate on-demand chunks (`next/dynamic`).
- WebKit/Safari-specific bug: the USSD simulator's community `<select>`
  rendered invisible white-on-white text — fixed with `[color-scheme:dark]`.
