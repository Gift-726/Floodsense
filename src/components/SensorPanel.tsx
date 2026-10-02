"use client";

import { ErrorState } from "@/components/ErrorState";
import { useApi } from "@/lib/useApi";
import type { SensorsResponse } from "@/lib/types";

const SCENARIO_STYLE: Record<string, { dot: string; text: string }> = {
  NORMAL: { dot: "bg-[var(--status-good)]", text: "text-[var(--status-good)]" },
  WARNING: { dot: "bg-[var(--status-warning)]", text: "text-[var(--status-warning)]" },
  CRITICAL: { dot: "bg-[var(--status-critical)]", text: "text-[var(--status-critical)]" },
  FLOOD: { dot: "bg-[var(--status-critical)]", text: "text-[var(--status-critical)]" },
};
const DEFAULT_STYLE = { dot: "bg-slate-500", text: "text-slate-400" };

export function SensorPanel() {
  const { data, error, loading, retry } = useApi<SensorsResponse>("/api/sensors", 15000);
  const nodes = data?.nodes ?? null;

  return (
    <section
      id="sensor-status"
      className="flex min-h-0 flex-1 flex-col rounded border border-slate-800 bg-slate-950 p-3 transition-shadow"
    >
      <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
        Sensor Network ({nodes?.length ?? 35} nodes)
      </h2>
      {error ? (
        <ErrorState message={error} onRetry={retry} />
      ) : loading || !nodes ? (
        <div className="flex flex-1 items-center justify-center text-xs text-slate-600">
          Loading sensors…
        </div>
      ) : (
        <ul className="flex-1 divide-y divide-slate-900 overflow-y-auto">
          {nodes.map((node) => {
            const style = SCENARIO_STYLE[node.scenario] ?? DEFAULT_STYLE;
            return (
              <li key={node.node_id} className="flex items-center justify-between gap-2 py-1.5">
                <div className="min-w-0">
                  <div className="truncate text-sm text-slate-200">{node.name}</div>
                  <div className="truncate text-[11px] text-slate-500">
                    {node.river} &middot; {node.lga}
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <span className="text-xs tabular-nums text-slate-300">
                    {node.water_level_m.toFixed(2)}m
                  </span>
                  <span className={`flex items-center gap-1 text-[11px] capitalize ${style.text}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
                    {node.scenario.toLowerCase()}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
