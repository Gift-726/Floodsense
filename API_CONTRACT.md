# FloodSense Kogi — API Contract (v0.2 — real model integrated)

Owner: Gift (Software Engineer). `/api/forecast` and `/api/sensors` now serve the Data
Scientist's real handoff (`src/data/model/`, see `docs/MODEL_HANDOFF.md`). `/api/alerts`
remains a GIS-adjacent heuristic layer — see below for why.

## GET /api/forecast

Returns the Data Scientist's `forecast.json` verbatim (re-drop a refreshed file with the
same schema at `src/data/model/forecast.json` to update it — no code change needed).

```json
{
  "system": "FloodSense Kogi",
  "model": {
    "name": "FloodSense Implementable Daily Model",
    "version": "corrected_causal_61_feature_h30",
    "resolution": "daily",
    "target": "grdc_discharge",
    "monitoring_point": "GRDC discharge monitoring point",
    "feature_count": 61,
    "training_alert_threshold_m3s": 17414.65,
    "alert_quantile": 0.9,
    "exogenous_availability_lag_days": 1,
    "minimum_consecutive_daily_rows": 61
  },
  "forecast_origin": "2025-12-31",
  "forecasts": [
    {
      "lead_days": 1,
      "target_date": "2026-01-01",
      "predicted_discharge_m3s": 3425.17,
      "prediction_lower_m3s": 2773.56,
      "prediction_upper_m3s": 4076.78,
      "prediction_interval_nominal_coverage": 0.9,
      "flood_probability": 0.0027,
      "operating_probability_threshold": 0.91,
      "warning_state": "GREEN",
      "training_alert_threshold_m3s": 17414.65
    }
  ]
}
```

- `forecasts`: exactly 7 entries, `lead_days` always `1 | 3 | 7 | 14 | 16 | 21 | 30`.
- Daily resolution forecasting river discharge at **one** monitoring point (Lokoja GRDC) —
  not an hourly curve, and not per-LGA water depth. See `docs/MODEL_HANDOFF.md` §6 for why
  spatial interpretation must stay separate from the hydrological forecast.
- `warning_state`: `"GREEN" | "YELLOW" | "RED"`, model-calibrated per horizon.
- **Do not** claim a "flagged Critical X hours before peak flooding" number anywhere — the
  independent 2022 GRDC event backtest is explicitly `NOT_COMPUTABLE` (missing real
  observations). Use the real validation metrics in `docs/daily_flood_detection_metrics.csv`
  instead (e.g. 100% recall / 0 missed critical days at the 7-day horizon).

## GET /api/sensors

Returns the Data Scientist's model-driven sensor simulator snapshot, positioned onto our own
real-town anchors (`src/lib/kogiPlaces.ts`) since the source file carries no location data.

```json
{
  "updated_at": "2025-12-31T00:00:00",
  "model_lead_day": 0,
  "daily_model_flood_probability": 0.0,
  "nodes": [
    {
      "node_id": "KGI-S01",
      "name": "Lokoja Gauge",
      "lga": "Lokoja",
      "river": "Niger",
      "lat": 7.79,
      "lng": 6.74,
      "scenario": "NORMAL",
      "discharge_m3s": 3428.15,
      "water_level_m": 0.99
    }
  ]
}
```

- 35 nodes. `scenario` is whatever the source file says (currently only `"NORMAL"` examples
  exist) — rendered as-is, not reinterpreted through invented thresholds.
- This is a **snapshot**, not a continuously running process. Re-drop a refreshed
  `sensor_readings.json` (same schema) to update it.

## GET/POST /api/alerts, /api/alerts/dispatch, /api/alerts/report, /api/alerts/reset

Community severity is a **geography-based heuristic** (`src/lib/mockRisk.ts`), bumped by the
real model's `warning_state` at the horizon currently focused on the dashboard
(`bumpForWarningState` in `src/lib/model.ts`). This is intentional, not a shortcut — the real
model only forecasts discharge at one point; per-community severity is exactly the kind of
"GIS application" interpretation `docs/MODEL_HANDOFF.md` describes as the software layer's job,
not the model's.

```json
{
  "updated_at": "2026-08-20T12:00:00.000Z",
  "communities": [
    { "name": "Lokoja", "lga": "Lokoja", "severity": "critical", "population": 5000, "status": "evacuating" }
  ],
  "alert_log": [
    { "time": "2026-08-20T12:00:00.000Z", "community": "Lokoja", "message": "Alert dispatched — IVR initiated in Igala/Ebira, SMS sent to 340 numbers" }
  ],
  "reports": [
    { "community": "Lokoja", "time": "2026-08-20T12:05:00.000Z", "water_level": "Knee height", "reporter_count": 3 }
  ]
}
```

- `GET /api/alerts?horizon=1|7|30` — `severity`: `"low"|"medium"|"high"|"critical"`,
  `status`: `"monitoring"|"warning"|"alerted"|"evacuating"`.
- `POST /api/alerts/dispatch` — body `{ "horizon": 7 }` — marks high/critical communities
  dispatched; persists in `.demo-state.json` (gitignored; not a real database — see
  `KNOWN_ISSUES.md`).
- `POST /api/alerts/report` — body `{ "community": "Lokoja", "water_level": "Knee height" }`.
- `POST /api/alerts/reset` — clears demo state before a filming take.

## Still outstanding (GIS Person's deliverables)

`flood_extent_2022.geojson` and `evacuation_routes.geojson` don't exist yet — no real source
data to build those layers from. `kogi_lgas.geojson` was sourced independently from
geoBoundaries (CC BY 4.0), not from the GIS Person.
