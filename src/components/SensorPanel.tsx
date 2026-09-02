"use client";

import { useEffect, useState } from "react";
import { IconTrendDown, IconTrendFlat, IconTrendUp } from "@/components/icons";
import type { SensorNode, SensorsResponse, SensorStatus } from "@/lib/types";
import type { Scenario } from "@/lib/scenario";

const STATUS_ORDER: Record<SensorStatus, number> = { offline: 0, warning: 1, online: 2 };

const STATUS_STYLE: Record<SensorStatus, { dot: string; text: string }> = {
  online: { dot: "bg-[var(--status-good)]", text: "text-[var(--status-good)]" },
  warning: { dot: "bg-[var(--status-warning)]", text: "text-[var(--status-warning)]" },
  offline: { dot: "bg-[var(--status-critical)]", text: "text-[var(--status-critical)]" },
};

const TREND_ICON = { rising: IconTrendUp, stable: IconTrendFlat, falling: IconTrendDown };

export function SensorPanel({ scenario }: { scenario: Scenario }) {
  const [nodes, setNodes] = useState<SensorNode[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/sensors?scenario=${scenario}`)
      .then((r) => r.json() as Promise<SensorsResponse>)
      .then((data) => {
        if (!cancelled) {
          setNodes(
            [...data.nodes].sort((a, b) => STATUS_ORDER[a.status] - STATUS_ORDER[b.status])
          );
        }
      });
    return () => {
      cancelled = true;
    };
  }, [scenario]);

  const onlineCount = nodes?.filter((n) => n.status === "online").length ?? 0;

  return (
    <section
      id="sensor-status"
      className="flex min-h-0 flex-1 flex-col rounded border border-slate-800 bg-slate-950 p-3 transition-shadow"
    >
      <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
        Sensor Status ({onlineCount}/{nodes?.length ?? 35} nodes)
      </h2>
      {!nodes ? (
        <div className="flex flex-1 items-center justify-center text-xs text-slate-600">
          Loading sensors…
        </div>
      ) : (
        <ul className="flex-1 divide-y divide-slate-900 overflow-y-auto">
          {nodes.map((node) => {
            const TrendIcon = TREND_ICON[node.trend];
            const style = STATUS_STYLE[node.status];
            return (
              <li key={node.node_id} className="flex items-center justify-between gap-2 py-1.5">
                <div className="min-w-0">
                  <div className="truncate text-sm text-slate-200">{node.name}</div>
                  <div className="truncate text-[11px] text-slate-500">
                    {node.river} &middot; {node.lga}
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <span className="flex items-center gap-1 text-xs tabular-nums text-slate-300">
                    <TrendIcon className="h-3 w-3 text-slate-500" />
                    {node.reading_m.toFixed(1)}m
                  </span>
                  <span className={`flex items-center gap-1 text-[11px] ${style.text}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
                    {node.status}
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
