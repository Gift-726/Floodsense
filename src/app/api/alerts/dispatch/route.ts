import { NextResponse } from "next/server";
import { dispatchAlerts } from "@/lib/alertsStore";
import { isScenario } from "@/lib/scenario";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const scenario = isScenario(body?.scenario) ? body.scenario : "t72";
  const result = dispatchAlerts(scenario);
  return NextResponse.json(result);
}
