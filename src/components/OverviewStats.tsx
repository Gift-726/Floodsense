"use client";

import { useCallback, useEffect, useState } from "react";
import { StatTile } from "@/components/StatTile";
import { ErrorState } from "@/components/ErrorState";
import type { AlertsResponse, ForecastResponse, SensorsResponse } from "@/lib/types";
import type { Scenario } from "@/lib/scenario";

type Stats = {
  activeAlerts: number;
  totalCommunities: number;
  nodesOnline: number;
  totalNodes: number;
  lagdoActive: boolean;
  peakProbability: number;
};

function peakAccent(probability: number): "good" | "warning" | "serious" | "critical" {
  if (probability >= 75) return "critical";
  if (probability >= 50) return "serious";
  if (probability >= 25) return "warning";
  return "good";
}

export function OverviewStats({ scenario }: { scenario: Scenario }) {
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(
    async (isPoll: boolean) => {
      try {
        const fetchJson = async <T,>(url: string): Promise<T> => {
          const r = await fetch(url);
          if (!r.ok) throw new Error(`${r.status} ${r.statusText}`);
          return r.json() as Promise<T>;
        };
        const [forecast, sensors, alerts] = await Promise.all([
          fetchJson<ForecastResponse>(`/api/forecast?scenario=${scenario}`),
          fetchJson<SensorsResponse>(`/api/sensors?scenario=${scenario}`),
          fetchJson<AlertsResponse>(`/api/alerts?scenario=${scenario}`),
        ]);

        setStats({
          activeAlerts: alerts.communities.filter(
            (c) => c.status === "alerted" || c.status === "evacuating"
          ).length,
          totalCommunities: alerts.communities.length,
          nodesOnline: sensors.nodes.filter((n) => n.status === "online").length,
          totalNodes: sensors.nodes.length,
          lagdoActive: forecast.lagdo_risk_flag,
          peakProbability: Math.max(0, ...forecast.hours.map((h) => h.probability)),
        });
        setError(null);
      } catch (err) {
        if (!isPoll) setError(err instanceof Error ? err.message : "Failed to load");
      }
    },
    [scenario]
  );

  useEffect(() => {
    let cancelled = false;
    const wrappedLoad = (isPoll: boolean) => {
      if (!cancelled) load(isPoll);
    };
    wrappedLoad(false);
    const interval = window.setInterval(() => wrappedLoad(true), 5000);
    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, [load]);

  if (error && !stats) {
    return (
      <div className="h-[88px] border-b border-slate-800 bg-slate-900 p-3">
        <ErrorState message={error} onRetry={() => load(false)} />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 border-b border-slate-800 bg-slate-900 p-3 sm:grid-cols-4">
      <StatTile
        label="Active Alerts"
        value={stats ? String(stats.activeAlerts) : "—"}
        caption={stats ? `of ${stats.totalCommunities} communities` : "loading…"}
        accent={stats && stats.activeAlerts > 0 ? "critical" : "good"}
      />
      <StatTile
        label="Nodes Online"
        value={stats ? `${stats.nodesOnline}/${stats.totalNodes}` : "—"}
        caption="river gauge network"
        accent={stats && stats.nodesOnline === stats.totalNodes ? "good" : "warning"}
      />
      <StatTile
        label="Peak 72hr Risk"
        value={stats ? `${stats.peakProbability}%` : "—"}
        caption="flood probability"
        accent={stats ? peakAccent(stats.peakProbability) : "neutral"}
      />
      <StatTile
        label="Lagdo Proxy"
        value={stats ? (stats.lagdoActive ? "Elevated" : "Normal") : "—"}
        caption="upstream release risk"
        accent={stats ? (stats.lagdoActive ? "critical" : "good") : "neutral"}
      />
    </div>
  );
}
