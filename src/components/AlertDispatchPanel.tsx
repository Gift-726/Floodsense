"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { RISK_COLOR } from "@/lib/mockRisk";
import { COMMUNITY_STATUS_COLOR } from "@/lib/statusColors";
import type { Scenario } from "@/lib/scenario";
import type { AlertLogEntry, AlertsResponse, Community } from "@/lib/types";

function timeLabel(iso: string) {
  return new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

export function AlertDispatchPanel({ scenario }: { scenario: Scenario }) {
  const [communities, setCommunities] = useState<Community[] | null>(null);
  const [alertLog, setAlertLog] = useState<AlertLogEntry[]>([]);
  const [dispatching, setDispatching] = useState(false);
  const pollRef = useRef<number | null>(null);

  const load = useCallback(() => {
    fetch(`/api/alerts?scenario=${scenario}`)
      .then((r) => r.json() as Promise<AlertsResponse>)
      .then((data) => {
        setCommunities(data.communities);
        setAlertLog(data.alert_log);
      });
  }, [scenario]);

  useEffect(() => {
    load();
    pollRef.current = window.setInterval(load, 4000);
    return () => {
      if (pollRef.current) window.clearInterval(pollRef.current);
    };
  }, [load]);

  async function handleDispatch() {
    setDispatching(true);
    try {
      await fetch("/api/alerts/dispatch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scenario }),
      });
      load();
    } finally {
      setDispatching(false);
    }
  }

  const dispatchable = communities?.some((c) => c.severity === "high" || c.severity === "critical") ?? false;

  return (
    <section
      id="alert-dispatch"
      className="flex h-96 shrink-0 flex-col rounded border border-slate-800 bg-slate-950 p-3 transition-shadow md:h-auto md:min-h-0 md:flex-1"
    >
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          Alert Dispatch
        </h2>
        <button
          type="button"
          onClick={handleDispatch}
          disabled={!dispatchable || dispatching}
          className="rounded bg-[var(--status-critical)] px-3 py-1 text-xs font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-30"
        >
          {dispatching ? "Dispatching…" : "Dispatch Alert"}
        </button>
      </div>
      <div className="flex min-h-0 flex-1 flex-col gap-3 md:flex-row">
        <div className="min-w-0 flex-1 overflow-auto">
          {!communities ? (
            <div className="flex h-full items-center justify-center text-xs text-slate-600">
              Loading communities…
            </div>
          ) : (
            <table className="w-full min-w-[520px] border-collapse text-xs">
              <thead className="sticky top-0 bg-slate-950 text-slate-500">
                <tr className="text-left">
                  <th className="py-1 pr-2 font-medium">Community</th>
                  <th className="py-1 pr-2 font-medium">LGA</th>
                  <th className="py-1 pr-2 font-medium">Severity</th>
                  <th className="py-1 pr-2 font-medium">ETA</th>
                  <th className="py-1 pr-2 font-medium">Population</th>
                  <th className="py-1 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {communities.map((c) => (
                  <tr key={c.name} className="border-t border-slate-900">
                    <td className="py-1.5 pr-2 text-slate-200">{c.name}</td>
                    <td className="py-1.5 pr-2 text-slate-400">{c.lga}</td>
                    <td className="py-1.5 pr-2">
                      <span
                        className="rounded px-1.5 py-0.5 capitalize"
                        style={{ color: RISK_COLOR[c.severity], background: `${RISK_COLOR[c.severity]}22` }}
                      >
                        {c.severity}
                      </span>
                    </td>
                    <td className="py-1.5 pr-2 tabular-nums text-slate-400">{c.est_flood_arrival_hours}h</td>
                    <td className="py-1.5 pr-2 tabular-nums text-slate-400">{c.population.toLocaleString()}</td>
                    <td className="py-1.5">
                      <span className="flex items-center gap-1 capitalize text-slate-300">
                        <span
                          className="h-1.5 w-1.5 rounded-full"
                          style={{ backgroundColor: COMMUNITY_STATUS_COLOR[c.status] }}
                        />
                        {c.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        <div className="max-h-32 shrink-0 overflow-y-auto border-t border-slate-900 pt-3 md:max-h-none md:w-64 md:border-l md:border-t-0 md:pl-3 md:pt-0">
          <div className="mb-1 text-[11px] font-medium uppercase tracking-wide text-slate-500">
            Alert Log
          </div>
          {alertLog.length === 0 ? (
            <p className="text-[11px] text-slate-600">No alerts dispatched yet.</p>
          ) : (
            <ul className="space-y-1.5">
              {alertLog.map((entry, i) => (
                <li key={`${entry.time}-${i}`} className="text-[11px] text-slate-400">
                  <span className="text-slate-600">{timeLabel(entry.time)}</span> {entry.message}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
