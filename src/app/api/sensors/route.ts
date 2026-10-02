import fs from "node:fs";
import path from "node:path";
import { NextResponse } from "next/server";
import { KOGI_PLACES } from "@/lib/kogiPlaces";
import type { ModelSensorSnapshot } from "@/lib/model";

// Real model-driven sensor simulator output from the Data Scientist's
// handoff — discharge/water-level readings and the "scenario" label are
// real. The 35 readings carry no location metadata, so we position them at
// our own real-town anchors (kogiPlaces.ts) in file order — an honest,
// clearly-labeled placement, not a claim that KGI-S01 actually sits in
// Lokoja. See docs/MODEL_HANDOFF.md.
const SENSOR_FILE = path.join(process.cwd(), "src/data/model/sensor_readings.json");

// Force dynamic — see forecast/route.ts for why.
export const dynamic = "force-dynamic";

function jitter(seed: number) {
  const x = Math.sin(seed * 999.123) * 10000;
  return (x - Math.floor(x) - 0.5) * 0.12;
}

export async function GET() {
  const raw = fs.readFileSync(SENSOR_FILE, "utf8");
  const snapshot = JSON.parse(raw) as ModelSensorSnapshot;

  const nodes = snapshot.sensors.map((sensor, i) => {
    const place = KOGI_PLACES[i % KOGI_PLACES.length];
    return {
      node_id: sensor.sensor_id,
      name: `${place.name} Gauge`,
      lga: place.lga,
      river: place.river,
      lat: Number((place.lat + jitter(i * 7)).toFixed(4)),
      lng: Number((place.lng + jitter(i * 11)).toFixed(4)),
      scenario: sensor.scenario,
      discharge_m3s: sensor.simulated_discharge_m3s,
      water_level_m: sensor.simulated_water_level_m,
    };
  });

  return NextResponse.json({
    updated_at: snapshot.timestamp,
    model_lead_day: snapshot.model_lead_day,
    daily_model_flood_probability: snapshot.daily_model_flood_probability,
    nodes,
  });
}
