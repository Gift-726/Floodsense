import { NextResponse } from "next/server";
import { isScenario, SCENARIO_INTENSITY, type Scenario } from "@/lib/scenario";

// Stub implementation — Week 1 skeleton only.
// Data Scientist replaces this with real LSTM output per API_CONTRACT.md.

function buildMockForecast(scenario: Scenario) {
  const intensity = SCENARIO_INTENSITY[scenario];
  const peak = 40 + intensity * 55; // t72 tops out ~48%, t0 ~95%
  const hours = Array.from({ length: 72 }, (_, h) => {
    const progress = h / 71;
    const probability = Math.round(Math.min(97, 8 + progress * peak));
    const spread = Math.round(5 + progress * 12);
    return {
      hour: h,
      probability,
      confidence_low: Math.max(0, probability - spread),
      confidence_high: Math.min(100, probability + spread),
    };
  });

  return {
    scenario,
    generated_at: new Date().toISOString(),
    lagdo_risk_flag: intensity >= 0.5,
    hours,
  };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const raw = searchParams.get("scenario");
  const scenario = isScenario(raw) ? raw : "t72";
  return NextResponse.json(buildMockForecast(scenario));
}
