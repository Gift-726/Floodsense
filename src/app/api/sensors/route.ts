import { NextResponse } from "next/server";

// Stub implementation — Week 1 skeleton only.
// GIS Person's sensor_nodes.geojson + Data Scientist's simulator replace this
// per API_CONTRACT.md.

const RIVERS = ["Niger", "Benue"] as const;
const TRENDS = ["rising", "stable", "falling"] as const;
const STATUSES = ["online", "warning", "offline"] as const;

function buildMockSensors() {
  const nodes = Array.from({ length: 35 }, (_, i) => {
    const id = i + 1;
    return {
      node_id: `KG-${String(id).padStart(2, "0")}`,
      name: `Sensor Node ${id}`,
      lga: "TBD",
      river: RIVERS[id % RIVERS.length],
      lat: 7.79,
      lng: 6.74,
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
