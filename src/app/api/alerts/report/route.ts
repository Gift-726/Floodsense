import { NextResponse } from "next/server";
import { addReport } from "@/lib/alertsStore";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const community = typeof body?.community === "string" ? body.community : null;
  const waterLevel = typeof body?.water_level === "string" ? body.water_level : null;

  if (!community || !waterLevel) {
    return NextResponse.json({ error: "community and water_level are required" }, { status: 400 });
  }

  const reports = addReport(community, waterLevel);
  return NextResponse.json({ reports });
}
