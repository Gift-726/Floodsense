"use client";

import { useEffect, useState } from "react";
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { ForecastResponse } from "@/lib/types";

type ChartPoint = {
  hour: number;
  probability: number;
  band: [number, number];
};

export function ForecastPanel() {
  const [data, setData] = useState<ChartPoint[] | null>(null);
  const [lagdoActive, setLagdoActive] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/forecast")
      .then((r) => r.json() as Promise<ForecastResponse>)
      .then((forecast) => {
        if (cancelled) return;
        setLagdoActive(forecast.lagdo_risk_flag);
        setData(
          forecast.hours.map((h) => ({
            hour: h.hour,
            probability: h.probability,
            band: [h.confidence_low, h.confidence_high],
          }))
        );
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="rounded border border-slate-800 bg-slate-950 p-3">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          72-Hour Forecast
        </h2>
        {lagdoActive && (
          <span className="rounded bg-[var(--status-critical-wash)] px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-[var(--status-critical)]">
            Lagdo elevated
          </span>
        )}
      </div>
      <div className="h-44">
        {!data ? (
          <div className="flex h-full items-center justify-center text-xs text-slate-600">
            Loading forecast…
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
              <CartesianGrid stroke="var(--chart-grid)" vertical={false} />
              <XAxis
                dataKey="hour"
                ticks={[0, 24, 48, 72]}
                tickFormatter={(h) => `${h}h`}
                tick={{ fill: "var(--chart-axis)", fontSize: 10 }}
                axisLine={{ stroke: "var(--chart-grid)" }}
                tickLine={false}
              />
              <YAxis
                domain={[0, 100]}
                tickFormatter={(v) => `${v}%`}
                tick={{ fill: "var(--chart-axis)", fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                width={36}
              />
              <ReferenceLine
                y={75}
                stroke="var(--status-critical)"
                strokeDasharray="3 3"
                strokeOpacity={0.6}
              />
              <ReferenceLine
                y={50}
                stroke="var(--status-serious)"
                strokeDasharray="3 3"
                strokeOpacity={0.6}
              />
              <Tooltip
                contentStyle={{
                  background: "#020617",
                  border: "1px solid #1e293b",
                  borderRadius: 6,
                  fontSize: 12,
                }}
                labelStyle={{ color: "#94a3b8" }}
                labelFormatter={(h) => `Hour ${h}`}
                formatter={(value, name) => {
                  if (name === "band" && Array.isArray(value)) {
                    return [`${value[0]}–${value[1]}%`, "Confidence"];
                  }
                  return [`${value}%`, "Probability"];
                }}
              />
              <Area
                dataKey="band"
                stroke="none"
                fill="var(--chart-fill)"
                isAnimationActive={false}
              />
              <Line
                dataKey="probability"
                stroke="var(--chart-line)"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: "var(--chart-line)", stroke: "#020617", strokeWidth: 2 }}
                isAnimationActive={false}
              />
            </ComposedChart>
          </ResponsiveContainer>
        )}
      </div>
    </section>
  );
}
