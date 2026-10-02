"use client";

import { useApi } from "@/lib/useApi";
import { pickHorizon, type FocusHorizon, type ModelForecast } from "@/lib/model";

const BANNER_STYLE: Record<"YELLOW" | "RED", string> = {
  YELLOW: "border-[var(--status-warning-ring)] bg-[var(--status-warning-solid)]",
  RED: "border-[var(--status-critical-ring)] bg-[var(--status-critical-solid)]",
};

export function WarningBanner({ horizon }: { horizon: FocusHorizon }) {
  const { data } = useApi<ModelForecast>("/api/forecast");
  const point = data ? pickHorizon(data, horizon) : undefined;

  if (!point || point.warning_state === "GREEN") return null;
  const style = BANNER_STYLE[point.warning_state as "YELLOW" | "RED"] ?? BANNER_STYLE.YELLOW;

  return (
    <div
      className={`absolute inset-x-2 bottom-2 z-20 flex items-center gap-2 rounded border px-3 py-1.5 text-[11px] font-medium text-white shadow-lg backdrop-blur md:inset-x-auto md:bottom-auto md:right-3 md:top-3 md:text-xs ${style}`}
    >
      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-white" />
      <span className="leading-tight">
        {point.warning_state} — T+{horizon}d discharge forecast {Math.round(point.predicted_discharge_m3s).toLocaleString()} m³/s
        ({(point.flood_probability * 100).toFixed(1)}% flood probability)
      </span>
    </div>
  );
}
