"use client";

import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ErrorState } from "@/components/ErrorState";
import { useApi } from "@/lib/useApi";
import type { ModelForecast, WarningState } from "@/lib/model";

type ChartPoint = {
  lead_days: number;
  target_date: string;
  predicted_discharge_m3s: number;
  band: [number, number];
  flood_probability: number;
  warning_state: WarningState;
};

const WARNING_COLOR: Record<WarningState, string> = {
  GREEN: "var(--status-good)",
  YELLOW: "var(--status-warning)",
  RED: "var(--status-critical)",
};

function Dot(props: { cx?: number; cy?: number; payload?: ChartPoint }) {
  const { cx, cy, payload } = props;
  if (cx === undefined || cy === undefined || !payload) return null;
  const color = WARNING_COLOR[payload.warning_state] ?? "#64748b";
  return <circle cx={cx} cy={cy} r={4} fill={color} stroke="#020617" strokeWidth={1.5} />;
}

export function ForecastPanel() {
  const { data: forecast, error, loading, retry } = useApi<ModelForecast>("/api/forecast");

  const data: ChartPoint[] | null =
    forecast?.forecasts.map((f) => ({
      lead_days: f.lead_days,
      target_date: f.target_date,
      predicted_discharge_m3s: f.predicted_discharge_m3s,
      band: [f.prediction_lower_m3s, f.prediction_upper_m3s],
      flood_probability: f.flood_probability,
      warning_state: f.warning_state,
    })) ?? null;

  return (
    <section className="rounded border border-slate-800 bg-slate-950 p-3">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          Discharge Forecast
        </h2>
        {forecast && (
          <span className="text-[10px] text-slate-600">
            Origin {forecast.forecast_origin}
          </span>
        )}
      </div>
      <div className="h-44">
        {error ? (
          <ErrorState message={error} onRetry={retry} />
        ) : loading || !data ? (
          <div className="flex h-full items-center justify-center text-xs text-slate-600">
            Loading forecast…
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
              <CartesianGrid stroke="var(--chart-grid)" vertical={false} />
              <XAxis
                dataKey="lead_days"
                type="number"
                domain={["dataMin", "dataMax"]}
                ticks={[1, 3, 7, 14, 16, 21, 30]}
                tickFormatter={(d) => `${d}d`}
                tick={{ fill: "var(--chart-axis)", fontSize: 10 }}
                axisLine={{ stroke: "var(--chart-grid)" }}
                tickLine={false}
              />
              <YAxis
                tickFormatter={(v) => `${Math.round(v / 1000)}k`}
                tick={{ fill: "var(--chart-axis)", fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                width={32}
              />
              <Tooltip
                contentStyle={{
                  background: "#020617",
                  border: "1px solid #1e293b",
                  borderRadius: 6,
                  fontSize: 12,
                }}
                labelStyle={{ color: "#94a3b8" }}
                labelFormatter={(d) => `T+${d} days`}
                formatter={(value, name, props) => {
                  if (name === "band" && Array.isArray(value)) {
                    return [`${Math.round(value[0])}–${Math.round(value[1])} m³/s`, "Interval"];
                  }
                  const point = props.payload as ChartPoint;
                  return [
                    `${Math.round(point.predicted_discharge_m3s)} m³/s · ${point.warning_state} · ${(point.flood_probability * 100).toFixed(1)}% prob.`,
                    "Discharge",
                  ];
                }}
              />
              <Area
                dataKey="band"
                stroke="none"
                fill="var(--chart-fill)"
                isAnimationActive={false}
              />
              <Line
                dataKey="predicted_discharge_m3s"
                stroke="var(--chart-line)"
                strokeWidth={2}
                dot={<Dot />}
                activeDot={{ r: 5 }}
                isAnimationActive={false}
              />
            </ComposedChart>
          </ResponsiveContainer>
        )}
      </div>
      {forecast && (
        <p className="mt-1.5 text-[10px] leading-snug text-slate-600">
          Alert threshold {Math.round(forecast.model.training_alert_threshold_m3s).toLocaleString()} m³/s (training p90) &middot;{" "}
          {forecast.model.version}
        </p>
      )}
    </section>
  );
}
