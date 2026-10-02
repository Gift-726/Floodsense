"use client";

import { useCallback, useEffect, useState } from "react";
import { StatTile } from "@/components/StatTile";
import { ErrorState } from "@/components/ErrorState";
import { pickHorizon, type FocusHorizon, type ModelForecast } from "@/lib/model";
import type { AlertsResponse } from "@/lib/types";

type Stats = {
  activeAlerts: number;
  totalCommunities: number;
  warningState: "GREEN" | "YELLOW" | "RED";
  floodProbability: number;
  dischargeM3s: number;
  thresholdM3s: number;
};

const WARNING_ACCENT: Record<Stats["warningState"], "good" | "warning" | "critical"> = {
  GREEN: "good",
  YELLOW: "warning",
  RED: "critical",
};

export function OverviewStats({ horizon }: { horizon: FocusHorizon }) {
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
        const [forecast, alerts] = await Promise.all([
          fetchJson<ModelForecast>("/api/forecast"),
          fetchJson<AlertsResponse>(`/api/alerts?horizon=${horizon}`),
        ]);
        const point = pickHorizon(forecast, horizon);

        setStats({
          activeAlerts: alerts.communities.filter(
            (c) => c.status === "alerted" || c.status === "evacuating"
          ).length,
          totalCommunities: alerts.communities.length,
          warningState: (point?.warning_state ?? "GREEN") as Stats["warningState"],
          floodProbability: point?.flood_probability ?? 0,
          dischargeM3s: point?.predicted_discharge_m3s ?? 0,
          thresholdM3s: forecast.model.training_alert_threshold_m3s,
        });
        setError(null);
      } catch (err) {
        if (!isPoll) setError(err instanceof Error ? err.message : "Failed to load");
      }
    },
    [horizon]
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
        label={`Warning State (T+${horizon}d)`}
        value={stats ? stats.warningState : "—"}
        caption="model-calibrated signal"
        accent={stats ? WARNING_ACCENT[stats.warningState] : "neutral"}
      />
      <StatTile
        label="Flood Probability"
        value={stats ? `${(stats.floodProbability * 100).toFixed(1)}%` : "—"}
        caption={`at T+${horizon} days`}
        accent={stats ? WARNING_ACCENT[stats.warningState] : "neutral"}
      />
      <StatTile
        label="Discharge Forecast"
        value={stats ? `${Math.round(stats.dischargeM3s).toLocaleString()} m³/s` : "—"}
        caption={stats ? `threshold ${Math.round(stats.thresholdM3s).toLocaleString()} m³/s` : "loading…"}
        accent="neutral"
      />
    </div>
  );
}
