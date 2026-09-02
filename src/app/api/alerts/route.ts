import { NextResponse } from "next/server";
import { getAlertLog, getCommunities, getReports } from "@/lib/alertsStore";
import { isScenario } from "@/lib/scenario";

// Stub implementation — Week 1 skeleton only.
// GIS Person's communities.geojson replaces this per API_CONTRACT.md.
// alert_log / reports are in-memory demo state — see alertsStore.ts.

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const raw = searchParams.get("scenario");
  const scenario = isScenario(raw) ? raw : "t72";

  return NextResponse.json({
    updated_at: new Date().toISOString(),
    communities: getCommunities(scenario),
    alert_log: getAlertLog(),
    reports: getReports(),
  });
}
