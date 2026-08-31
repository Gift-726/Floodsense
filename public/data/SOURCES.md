# Data sources

**kogi_lgas.geojson** — Kogi State's 21 LGA boundaries, filtered from
geoBoundaries' Nigeria ADM2 dataset (source: GRID3, CC BY 4.0).
https://www.geoboundaries.org/api/current/gbOpen/NGA/ADM2/

Real, licensed boundary data. The flood risk level per LGA shown on the map
is a placeholder heuristic (`src/lib/mockRisk.ts`), not model output — see
that file's header comment. Sensor and community marker coordinates
(`src/lib/kogiPlaces.ts`) are approximate town centers, not surveyed GPS
pins. All of this is superseded by GIS Person's real deliverables:
`kogi_lgas.geojson` (already have a better source here, but re-verify),
`flood_extent_2022.geojson`, `sensor_nodes.geojson`, `communities.geojson`,
`evacuation_routes.geojson` per the roadmap.
