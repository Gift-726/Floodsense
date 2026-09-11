"use client";

import { ErrorState } from "@/components/ErrorState";
import { useApi } from "@/lib/useApi";
import type { AlertsResponse } from "@/lib/types";
import type { Scenario } from "@/lib/scenario";

function timeLabel(iso: string) {
  return new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

export function CommunityReportFeed({ scenario }: { scenario: Scenario }) {
  const { data, error, loading, retry } = useApi<AlertsResponse>(
    `/api/alerts?scenario=${scenario}`,
    3000
  );
  const reports = data?.reports ?? null;

  return (
    <section className="flex h-40 w-full shrink-0 flex-col rounded border border-slate-800 bg-slate-950 p-3 md:w-72">
      <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
        Community Reports
      </h2>
      {error && !reports ? (
        <ErrorState message={error} onRetry={retry} />
      ) : loading || !reports ? (
        <div className="flex flex-1 items-center justify-center text-xs text-slate-600">
          Loading…
        </div>
      ) : reports.length === 0 ? (
        <div className="flex flex-1 items-center justify-center px-2 text-center text-[11px] text-slate-600">
          No reports yet — submit one from the USSD simulator at /community.
        </div>
      ) : (
        <ul className="flex-1 space-y-1.5 overflow-y-auto">
          {reports.map((r, i) => (
            <li key={`${r.community}-${r.time}-${i}`} className="text-[11px] text-slate-400">
              <span className="text-slate-200">{r.community}</span>{" "}
              <span className="text-slate-600">{timeLabel(r.time)}</span>
              <br />
              {r.water_level} &middot; {r.reporter_count} reporter{r.reporter_count === 1 ? "" : "s"}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
