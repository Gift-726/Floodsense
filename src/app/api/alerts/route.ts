import { NextResponse } from "next/server";
import { getAlertLog, getCommunities, getReports } from "@/lib/alertsStore";
import { isFocusHorizon, type FocusHorizon } from "@/lib/model";

// Community severity/status is a geography-based heuristic (mockRisk.ts)
// bumped by the real model's warning_state at the focused horizon — the
// model itself only forecasts discharge at one monitoring point, not
// per-LGA water depth (see docs/MODEL_HANDOFF.md section 6).
// alert_log / reports are demo state — see alertsStore.ts.

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const raw = searchParams.get("horizon");
  const horizon = (isFocusHorizon(raw) ? Number(raw) : 7) as FocusHorizon;

  return NextResponse.json({
    updated_at: new Date().toISOString(),
    communities: getCommunities(horizon),
    alert_log: getAlertLog(),
    reports: getReports(),
  });
}
