import { NextResponse } from "next/server";
import { KOGI_PLACES } from "@/lib/kogiPlaces";
import { isScenario, SCENARIO_INTENSITY, type Scenario } from "@/lib/scenario";

// Stub implementation — Week 1 skeleton only.
// GIS Person's sensor_nodes.geojson + Data Scientist's simulator replace this
// per API_CONTRACT.md. Coordinates jitter around real Kogi towns (see
// kogiPlaces.ts) — not surveyed bridge/gauge GPS pins.

const TRENDS = ["rising", "stable", "falling"] as const;

// Deterministic pseudo-random in [0, 1) so the layout is stable across requests.
function pseudoRandom(seed: number) {
  const x = Math.sin(seed * 999.123) * 10000;
  return x - Math.floor(x);
}

function statusForIntensity(id: number, intensity: number): "online" | "warning" | "offline" {
  const roll = pseudoRandom(id * 3.7);
  // More nodes drop to warning/offline as the scenario intensifies.
  if (roll < intensity * 0.35) return "offline";
  if (roll < intensity * 0.6) return "warning";
  return "online";
}

function buildMockSensors(scenario: Scenario) {
  const intensity = SCENARIO_INTENSITY[scenario];
  const nodes = Array.from({ length: 35 }, (_, i) => {
    const id = i + 1;
    const place = KOGI_PLACES[id % KOGI_PLACES.length];
    const jitter = () => (pseudoRandom(id * 7 + place.lat) - 0.5) * 0.12;

    return {
      node_id: `KG-${String(id).padStart(2, "0")}`,
      name: `${place.name} Gauge ${Math.ceil(id / KOGI_PLACES.length)}`,
      lga: place.lga,
      river: place.river,
      lat: Number((place.lat + jitter()).toFixed(4)),
      lng: Number((place.lng + jitter()).toFixed(4)),
      status: statusForIntensity(id, intensity),
      reading_m: Number((1.5 + (id % 5) * 0.3 + intensity * 3.5).toFixed(1)),
      trend: intensity > 0.4 ? "rising" : TRENDS[id % TRENDS.length],
      last_updated: new Date().toISOString(),
    };
  });

  return { updated_at: new Date().toISOString(), nodes };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const raw = searchParams.get("scenario");
  const scenario = isScenario(raw) ? raw : "t72";
  return NextResponse.json(buildMockSensors(scenario));
}
