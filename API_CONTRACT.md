# FloodSense Kogi — API Contract (v0.1, Week 1 draft)

Owner: Gift (Software Engineer). Consumed by: Data Scientist (`/api/forecast`, `/api/sensors`
readings), GIS Person (`/api/sensors` node metadata, `/api/alerts` community list).

All three routes are Next.js Route Handlers under `src/app/api/*/route.ts`, currently returning
mock data. Replace the mock generators with real data — keep the response shape identical so the
dashboard doesn't need changes when real data lands.

## GET /api/forecast

```json
{
  "scenario": "t72",
  "generated_at": "2026-08-20T12:00:00.000Z",
  "lagdo_risk_flag": false,
  "hours": [
    { "hour": 0, "probability": 10, "confidence_low": 5, "confidence_high": 15 }
  ]
}
```

- `scenario`: one of `"t72" | "t24" | "t0"` — matches the GIS scenario snapshots.
- `hours`: exactly 72 entries, `hour` 0–71.
- `probability`, `confidence_low`, `confidence_high`: integers 0–100.
- `lagdo_risk_flag`: true when upstream Adamawa/Taraba rainfall exceeds the pre-Lagdo-release
  pattern (Data Scientist's threshold classifier, Week 2).

## GET /api/sensors

```json
{
  "updated_at": "2026-08-20T12:00:00.000Z",
  "nodes": [
    {
      "node_id": "KG-01",
      "name": "Lokoja Bridge",
      "lga": "Lokoja",
      "river": "Niger",
      "lat": 7.793,
      "lng": 6.742,
      "status": "online",
      "reading_m": 3.2,
      "trend": "rising",
      "last_updated": "2026-08-20T12:00:00.000Z"
    }
  ]
}
```

- Exactly 35 nodes, `node_id` matching GIS Person's `sensor_nodes.geojson` `node_id` field.
- `status`: `"online" | "warning" | "offline"`.
- `trend`: `"rising" | "stable" | "falling"`.
- `reading_m`: current water level reading in metres, one decimal place.
- Data Scientist's Week 3 simulator writes to this endpoint every 15 minutes.

## GET /api/alerts

```json
{
  "updated_at": "2026-08-20T12:00:00.000Z",
  "communities": [
    {
      "name": "Ganaja",
      "lga": "Lokoja",
      "severity": "high",
      "est_flood_arrival_hours": 24,
      "population": 8200,
      "status": "warning"
    }
  ],
  "alert_log": [
    {
      "time": "2026-08-20T12:00:00.000Z",
      "community": "Ganaja",
      "message": "Alert dispatched — IVR initiated in Igala/Ebira, SMS sent to 340 numbers"
    }
  ],
  "reports": [
    {
      "community": "Ganaja",
      "time": "2026-08-20T12:05:00.000Z",
      "water_level": "Knee height",
      "reporter_count": 3
    }
  ]
}
```

- `communities`: 10 entries, `name` matching GIS Person's `communities.geojson`.
- `severity`: `"low" | "medium" | "high" | "critical"`.
- `status`: `"monitoring" | "warning" | "alerted" | "evacuating"`.
- `alert_log` and `reports` start empty; populated by the Week 3 Alert Dispatch Panel and the
  Community USSD Simulator respectively.

## Open questions for Week 1 Day 7 sync

- Confirm `node_id` / community `name` values match 1:1 between GeoJSON files and API responses.
- Confirm whether `/api/alerts` needs pagination once `alert_log`/`reports` grow during a live demo
  (unlikely at demo scale — revisit only if it becomes a problem).
