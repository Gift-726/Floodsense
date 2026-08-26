import { NextResponse } from "next/server";

// Stub implementation — Week 1 skeleton only.
// GIS Person's communities.geojson replaces the community list per
// API_CONTRACT.md. Alert log / report feed populate once the Alert
// Dispatch Panel (Week 3) is built.

const SEVERITIES = ["low", "medium", "high", "critical"] as const;
const STATUSES = ["monitoring", "warning", "alerted", "evacuating"] as const;

function buildMockAlerts() {
  const communities = Array.from({ length: 10 }, (_, i) => {
    const id = i + 1;
    return {
      name: `Community ${id}`,
      lga: "TBD",
      severity: SEVERITIES[id % SEVERITIES.length],
      est_flood_arrival_hours: 72 - id * 6,
      population: 5000 + id * 1200,
      status: STATUSES[id % STATUSES.length],
    };
  });

  return {
    updated_at: new Date().toISOString(),
    communities,
    alert_log: [],
    reports: [],
  };
}

export async function GET() {
  return NextResponse.json(buildMockAlerts());
}
