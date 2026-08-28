import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { MapView } from "@/components/MapView";
import { LagdoBanner } from "@/components/LagdoBanner";
import { OverviewStats } from "@/components/OverviewStats";
import { ForecastPanel } from "@/components/ForecastPanel";
import { SensorPanel } from "@/components/SensorPanel";
import { AlertPanel } from "@/components/AlertPanel";

export default function DashboardPage() {
  return (
    <div className="flex h-screen flex-col bg-slate-900 text-slate-100">
      <Header />
      <OverviewStats />
      <div className="flex min-h-0 flex-1">
        <Sidebar />
        <div className="flex min-h-0 flex-1 flex-col">
          <div className="flex min-h-0 flex-1">
            <main className="relative min-h-0 flex-1">
              <MapView />
              <LagdoBanner />
              <div className="pointer-events-none absolute left-3 top-3 z-10 rounded bg-slate-950/80 px-2.5 py-1 text-xs text-slate-300 backdrop-blur">
                Kogi State &middot; Niger&ndash;Benue Confluence
              </div>
            </main>
            <div className="flex w-80 shrink-0 flex-col gap-3 overflow-y-auto border-l border-slate-800 bg-slate-950 p-3">
              <ForecastPanel />
              <SensorPanel />
            </div>
          </div>
          <AlertPanel />
        </div>
      </div>
    </div>
  );
}
