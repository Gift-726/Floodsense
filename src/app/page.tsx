import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { MapView } from "@/components/MapView";
import { ForecastPanel } from "@/components/ForecastPanel";
import { SensorPanel } from "@/components/SensorPanel";
import { AlertPanel } from "@/components/AlertPanel";

export default function DashboardPage() {
  return (
    <div className="flex h-screen flex-col bg-slate-900 text-slate-100">
      <Header />
      <div className="flex min-h-0 flex-1">
        <Sidebar />
        <div className="flex min-h-0 flex-1 flex-col">
          <div className="flex min-h-0 flex-1">
            <main className="min-h-0 flex-1">
              <MapView />
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
