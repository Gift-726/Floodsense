import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { MobileNav } from "@/components/MobileNav";
import { PageIntro } from "@/components/PageIntro";
import { SensorPanel } from "@/components/SensorPanel";

export default function SensorsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-900 text-slate-100 md:h-screen">
      <Header />
      <MobileNav />
      <PageIntro title="Sensor Network">
        35 simulated river-gauge sensors positioned along the Niger and Benue rivers near real
        Kogi towns, each reporting discharge and water-level readings from the Data
        Scientist&rsquo;s model-driven simulator. In a production deployment these would be
        physical IoT devices on bridges and riverbanks — the &ldquo;eyes&rdquo; that feed the
        flood forecasting model.
      </PageIntro>
      <div className="flex flex-1 flex-col md:min-h-0 md:flex-row">
        <Sidebar />
        <div className="flex h-[32rem] flex-1 p-3 md:h-auto md:min-h-0">
          <SensorPanel />
        </div>
      </div>
    </div>
  );
}
