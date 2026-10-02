import { NextResponse } from "next/server";
import { dispatchAlerts } from "@/lib/alertsStore";
import { isFocusHorizon, type FocusHorizon } from "@/lib/model";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const raw = typeof body?.horizon === "number" ? String(body.horizon) : null;
  const horizon = (isFocusHorizon(raw) ? Number(raw) : 7) as FocusHorizon;
  const result = dispatchAlerts(horizon);
  return NextResponse.json(result);
}
