"use client";

import { useEffect, useState } from "react";
import type { ForecastResponse } from "@/lib/types";
import type { Scenario } from "@/lib/scenario";

export function LagdoBanner({ scenario }: { scenario: Scenario }) {
  const [active, setActive] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/forecast?scenario=${scenario}`)
      .then((r) => r.json() as Promise<ForecastResponse>)
      .then((forecast) => {
        if (!cancelled) setActive(forecast.lagdo_risk_flag);
      });
    return () => {
      cancelled = true;
    };
  }, [scenario]);

  if (!active) return null;

  return (
    <div className="absolute inset-x-2 bottom-2 z-20 flex items-center gap-2 rounded border border-[var(--status-critical-ring)] bg-[var(--status-critical-solid)] px-3 py-1.5 text-[11px] font-medium text-white shadow-lg backdrop-blur md:inset-x-auto md:bottom-auto md:right-3 md:top-3 md:text-xs">
      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-white" />
      <span className="leading-tight">LAGDO RISK ELEVATED — Upstream proxy model active</span>
    </div>
  );
}
