"use client";

import { useState } from "react";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { MapView } from "@/components/MapView";
import { LagdoBanner } from "@/components/LagdoBanner";
import { OverviewStats } from "@/components/OverviewStats";
import { ForecastPanel } from "@/components/ForecastPanel";
import { SensorPanel } from "@/components/SensorPanel";
import { AlertDispatchPanel } from "@/components/AlertDispatchPanel";
import { CommunityReportFeed } from "@/components/CommunityReportFeed";
import { ScenarioSwitcher } from "@/components/ScenarioSwitcher";
import type { Scenario } from "@/lib/scenario";

export default function DashboardPage() {
  const [scenario, setScenario] = useState<Scenario>("t72");

  return (
    <div className="flex h-screen flex-col bg-slate-900 text-slate-100">
      <Header />
      <OverviewStats scenario={scenario} />
      <div className="flex min-h-0 flex-1">
        <Sidebar />
        <div className="flex min-h-0 flex-1 flex-col">
          <div className="flex min-h-0 flex-[2]">
            <main id="dashboard-map" className="relative min-h-0 flex-1">
              <MapView scenario={scenario} />
              <LagdoBanner scenario={scenario} />
              <div className="pointer-events-none absolute left-3 top-3 z-10 rounded bg-slate-950/80 px-2.5 py-1 text-xs text-slate-300 backdrop-blur">
                Kogi State &middot; Niger&ndash;Benue Confluence
              </div>
              <div className="absolute left-3 top-12 z-10">
                <ScenarioSwitcher scenario={scenario} onChange={setScenario} />
              </div>
            </main>
            <div className="flex w-80 shrink-0 flex-col gap-3 overflow-y-auto border-l border-slate-800 bg-slate-950 p-3">
              <ForecastPanel scenario={scenario} />
              <SensorPanel scenario={scenario} />
            </div>
          </div>
          <div className="flex min-h-0 flex-1 gap-3 border-t border-slate-800 bg-slate-900 p-3">
            <AlertDispatchPanel scenario={scenario} />
            <CommunityReportFeed scenario={scenario} />
          </div>
        </div>
      </div>
    </div>
  );
}
