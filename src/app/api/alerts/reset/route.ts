import { NextResponse } from "next/server";
import { resetDemoState } from "@/lib/alertsStore";

// Clears dispatch/report demo state — run before each filming take so the
// dashboard starts from a clean "Monitoring" baseline.
export async function POST() {
  resetDemoState();
  return NextResponse.json({ ok: true });
}
