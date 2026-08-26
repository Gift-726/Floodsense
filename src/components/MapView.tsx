"use client";

import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { KOGI_CENTER, KOGI_DEFAULT_ZOOM } from "@/lib/kogi";

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

export function MapView() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    if (!MAPBOX_TOKEN || MAPBOX_TOKEN === "your_mapbox_access_token_here") {
      setError("Set NEXT_PUBLIC_MAPBOX_TOKEN in .env.local to load the map.");
      return;
    }

    mapboxgl.accessToken = MAPBOX_TOKEN;
    mapRef.current = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/dark-v11",
      center: KOGI_CENTER,
      zoom: KOGI_DEFAULT_ZOOM,
    });
    mapRef.current.addControl(new mapboxgl.NavigationControl(), "top-right");

    return () => {
      mapRef.current?.remove();
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

  return <div ref={containerRef} className="h-full w-full" />;
}
