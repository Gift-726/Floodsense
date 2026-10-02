import fs from "node:fs";
import path from "node:path";
import { NextResponse } from "next/server";
import type { ModelForecast } from "@/lib/model";

// Real model output from the Data Scientist's handoff (docs/MODEL_HANDOFF.md).
// Daily resolution, 7 fixed horizons, forecasts river discharge at the
// Lokoja GRDC point — not an hourly flood-event curve. Re-drop a refreshed
// forecast.json here (same schema) to pick up a new forecast_origin; no
// code change needed.
const FORECAST_FILE = path.join(process.cwd(), "src/data/model/forecast.json");

// Force dynamic: this route reads no request params, so Next.js would
// otherwise statically optimize it and bake in a build-time snapshot of the
// file instead of re-reading it on every request.
export const dynamic = "force-dynamic";

export async function GET() {
  const raw = fs.readFileSync(FORECAST_FILE, "utf8");
  const forecast = JSON.parse(raw) as ModelForecast;
  return NextResponse.json(forecast);
}
