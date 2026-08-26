import { NextResponse } from "next/server";

// Stub implementation — Week 1 skeleton only.
// Data Scientist replaces this with real LSTM output per API_CONTRACT.md.

function buildMockForecast() {
  const hours = Array.from({ length: 72 }, (_, h) => {
    const probability = Math.min(95, Math.round(10 + h * 0.9));
    const spread = Math.round(5 + h * 0.15);
    return {
      hour: h,
      probability,
      confidence_low: Math.max(0, probability - spread),
      confidence_high: Math.min(100, probability + spread),
    };
  });

  return {
    scenario: "t72",
    generated_at: new Date().toISOString(),
    lagdo_risk_flag: false,
    hours,
  };
}

export async function GET() {
  return NextResponse.json(buildMockForecast());
}
