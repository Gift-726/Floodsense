import { NextResponse } from "next/server";
import { KOGI_PLACES } from "@/lib/kogiPlaces";
import { LGA_RISK, type RiskLevel } from "@/lib/mockRisk";

// Stub implementation — Week 1 skeleton only.
// GIS Person's communities.geojson replaces this per API_CONTRACT.md. Alert
// log / report feed populate once the Alert Dispatch Panel (Week 3) is built.

const STATUS_BY_SEVERITY: Record<RiskLevel, "monitoring" | "warning" | "alerted" | "evacuating"> = {
  low: "monitoring",
  medium: "monitoring",
  high: "warning",
  critical: "alerted",
};

function buildMockAlerts() {
  const communities = KOGI_PLACES.map((place, i) => {
    const severity = LGA_RISK[place.lga] ?? "low";
    return {
      name: place.name,
      lga: place.lga,
      severity,
      est_flood_arrival_hours: 72 - i * 6,
      population: 5000 + i * 1200,
      status: STATUS_BY_SEVERITY[severity],
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
