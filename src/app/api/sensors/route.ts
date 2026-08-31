import { NextResponse } from "next/server";
import { KOGI_PLACES } from "@/lib/kogiPlaces";

// Stub implementation — Week 1 skeleton only.
// GIS Person's sensor_nodes.geojson + Data Scientist's simulator replace this
// per API_CONTRACT.md. Coordinates jitter around real Kogi towns (see
// kogiPlaces.ts) — not surveyed bridge/gauge GPS pins.

const TRENDS = ["rising", "stable", "falling"] as const;
const STATUSES = ["online", "warning", "offline"] as const;

// Deterministic pseudo-random in [0, 1) so the layout is stable across requests.
function pseudoRandom(seed: number) {
  const x = Math.sin(seed * 999.123) * 10000;
  return x - Math.floor(x);
}

function buildMockSensors() {
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
      status: STATUSES[id % STATUSES.length],
      reading_m: 2 + (id % 5) * 0.4,
      trend: TRENDS[id % TRENDS.length],
      last_updated: new Date().toISOString(),
    };
  });

  return { updated_at: new Date().toISOString(), nodes };
}

export async function GET() {
  return NextResponse.json(buildMockSensors());
}
