"use client";

import { useEffect, useRef, useState, type MutableRefObject } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { KOGI_CENTER, KOGI_DEFAULT_ZOOM } from "@/lib/kogi";
import { LGA_RISK, RISK_COLOR, RISK_ORDER, type RiskLevel } from "@/lib/mockRisk";
import type { AlertsResponse, SensorsResponse } from "@/lib/types";

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

const COMMUNITY_STATUS_COLOR: Record<string, string> = {
  monitoring: "#64748b",
  warning: "#fab219",
  alerted: "#d03b3b",
  evacuating: "#8b5cf6",
};

function buildRiskFillExpression(): mapboxgl.ExpressionSpecification {
  const stops = Object.entries(LGA_RISK).flatMap(([lga, level]) => [lga, RISK_COLOR[level]]);
  return ["match", ["get", "lga"], ...stops, "#334155"] as mapboxgl.ExpressionSpecification;
}

export function MapView() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    if (!MAPBOX_TOKEN || MAPBOX_TOKEN === "your_mapbox_access_token_here") {
      setError("Set NEXT_PUBLIC_MAPBOX_TOKEN in .env.local to load the map.");
      return;
    }

    mapboxgl.accessToken = MAPBOX_TOKEN;
    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/dark-v11",
      center: KOGI_CENTER,
      zoom: KOGI_DEFAULT_ZOOM,
    });
    mapRef.current = map;
    map.addControl(new mapboxgl.NavigationControl(), "top-right");

    const hoverPopup = new mapboxgl.Popup({
      closeButton: false,
      closeOnClick: false,
      className: "kogi-hover-popup",
    });

    map.on("load", () => {
      map.addSource("kogi-lgas", { type: "geojson", data: "/data/kogi_lgas.geojson" });

      map.addLayer({
        id: "lga-fill",
        type: "fill",
        source: "kogi-lgas",
        paint: { "fill-color": buildRiskFillExpression(), "fill-opacity": 0.35 },
      });

      map.addLayer({
        id: "lga-outline",
        type: "line",
        source: "kogi-lgas",
        paint: { "line-color": "#0f172a", "line-width": 1 },
      });

      map.on("mousemove", "lga-fill", (e) => {
        const feature = e.features?.[0];
        if (!feature) return;
        map.getCanvas().style.cursor = "pointer";
        const lga = feature.properties?.lga as string;
        const risk = (LGA_RISK[lga] ?? "low") as RiskLevel;
        hoverPopup
          .setLngLat(e.lngLat)
          .setHTML(
            `<div style="font:12px system-ui;color:#e2e8f0"><strong>${lga}</strong><br/>Risk: <span style="color:${RISK_COLOR[risk]}">${risk}</span></div>`
          )
          .addTo(map);
      });

      map.on("mouseleave", "lga-fill", () => {
        map.getCanvas().style.cursor = "";
        hoverPopup.remove();
      });

      loadMarkers(map, markersRef);
    });

    return () => {
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];
      map.remove();
      mapRef.current = null;
    };
  }, []);

  if (error) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-slate-900 text-center text-sm text-slate-500">
        <p className="max-w-xs">{error}</p>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full">
      <div ref={containerRef} className="h-full w-full" />
      <div className="pointer-events-none absolute bottom-9 left-3 z-10 rounded border border-slate-800 bg-slate-950/85 px-2.5 py-2 text-[11px] text-slate-300 backdrop-blur">
        <div className="mb-1 font-semibold uppercase tracking-wide text-slate-500">
          LGA flood risk
        </div>
        <div className="flex items-center gap-3">
          {RISK_ORDER.map((level) => (
            <span key={level} className="flex items-center gap-1 capitalize">
              <span
                className="h-2 w-2 rounded-sm"
                style={{ backgroundColor: RISK_COLOR[level] }}
              />
              {level}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

async function loadMarkers(map: mapboxgl.Map, markersRef: MutableRefObject<mapboxgl.Marker[]>) {
  const [sensors, alerts] = await Promise.all([
    fetch("/api/sensors").then((r) => r.json() as Promise<SensorsResponse>),
    fetch("/api/alerts").then((r) => r.json() as Promise<AlertsResponse>),
  ]);

  const sensorStatusColor: Record<string, string> = {
    online: "#0ca30c",
    warning: "#fab219",
    offline: "#d03b3b",
  };

  sensors.nodes.forEach((node) => {
    const el = document.createElement("div");
    el.style.cssText = `width:9px;height:9px;border-radius:50%;background:${sensorStatusColor[node.status]};border:1.5px solid #0f172a;cursor:pointer;`;
    const popup = new mapboxgl.Popup({ offset: 10 }).setHTML(
      `<div style="font:12px system-ui;color:#0f172a"><strong>${node.name}</strong><br/>${node.river} river &middot; ${node.lga}<br/>${node.reading_m.toFixed(1)}m &middot; ${node.status}</div>`
    );
    const marker = new mapboxgl.Marker({ element: el })
      .setLngLat([node.lng, node.lat])
      .setPopup(popup)
      .addTo(map);
    markersRef.current.push(marker);
  });

  alerts.communities.forEach((community) => {
    // approximate marker position: reuse the sensor anchor nearest this community by name match
    const anchor = sensors.nodes.find((n) => n.name.startsWith(community.name));
    if (!anchor) return;
    const el = document.createElement("div");
    el.style.cssText = `width:16px;height:16px;border-radius:50%;border:2.5px solid ${COMMUNITY_STATUS_COLOR[community.status]};box-shadow:0 0 0 2px rgba(15,23,42,0.8);cursor:pointer;`;
    const popup = new mapboxgl.Popup({ offset: 12 }).setHTML(
      `<div style="font:12px system-ui;color:#0f172a"><strong>${community.name}</strong><br/>${community.lga} &middot; pop. ${community.population.toLocaleString()}<br/>Severity: ${community.severity} &middot; ${community.status}</div>`
    );
    const marker = new mapboxgl.Marker({ element: el })
      .setLngLat([anchor.lng, anchor.lat])
      .setPopup(popup)
      .addTo(map);
    markersRef.current.push(marker);
  });
}
