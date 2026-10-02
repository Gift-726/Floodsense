"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { MobileNav } from "@/components/MobileNav";
import { WarningBanner } from "@/components/WarningBanner";
import { OverviewStats } from "@/components/OverviewStats";
import { SensorPanel } from "@/components/SensorPanel";
import { AlertDispatchPanel } from "@/components/AlertDispatchPanel";
import { CommunityReportFeed } from "@/components/CommunityReportFeed";
import { HorizonSwitcher } from "@/components/HorizonSwitcher";
import type { FocusHorizon } from "@/lib/model";

// Mapbox GL and Recharts are the two heaviest dependencies in the bundle —
// load them as separate chunks so the header/stats/nav shell paints
// immediately instead of waiting on ~500kB of JS it doesn't need.
const MapView = dynamic(() => import("@/components/MapView").then((m) => m.MapView), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-slate-900 text-xs text-slate-600">
      Loading map…
    </div>
  ),
});

const ForecastPanel = dynamic(
  () => import("@/components/ForecastPanel").then((m) => m.ForecastPanel),
  {
    ssr: false,
    loading: () => (
      <section className="rounded border border-slate-800 bg-slate-950 p-3">
        <div className="mb-2 h-3.5 w-32 rounded bg-slate-800" />
        <div className="flex h-44 items-center justify-center text-xs text-slate-600">
          Loading forecast…
        </div>
      </section>
    ),
  }
);

export default function DashboardPage() {
  const [horizon, setHorizon] = useState<FocusHorizon>(7);

  return (
    <div className="flex min-h-screen flex-col bg-slate-900 text-slate-100 md:h-screen">
      <Header />
      <MobileNav />
      <OverviewStats horizon={horizon} />
      <div className="flex flex-1 flex-col md:min-h-0 md:flex-row">
        <Sidebar />
        <div className="flex flex-1 flex-col md:min-h-0">
          <div className="flex flex-col md:min-h-0 md:flex-[2] md:flex-row">
            <main
              id="dashboard-map"
              className="relative h-72 shrink-0 md:h-auto md:min-h-0 md:flex-1"
            >
              <MapView horizon={horizon} />
              <WarningBanner horizon={horizon} />
              <div className="pointer-events-none absolute left-3 top-3 z-10 rounded bg-slate-950/80 px-2.5 py-1 text-xs text-slate-300 backdrop-blur">
                Kogi State &middot; Niger&ndash;Benue Confluence
              </div>
              <div className="absolute left-3 top-12 z-10">
                <HorizonSwitcher horizon={horizon} onChange={setHorizon} />
              </div>
            </main>
            <div className="flex h-[28rem] shrink-0 flex-col gap-3 overflow-y-auto border-t border-slate-800 bg-slate-950 p-3 md:h-auto md:w-80 md:border-l md:border-t-0">
              <ForecastPanel />
              <SensorPanel />
            </div>
          </div>
          <div className="flex flex-col gap-3 border-t border-slate-800 bg-slate-900 p-3 md:min-h-0 md:flex-1 md:flex-row">
            <AlertDispatchPanel horizon={horizon} />
            <CommunityReportFeed horizon={horizon} />
          </div>
        </div>
      </div>
    </div>
  );
}
