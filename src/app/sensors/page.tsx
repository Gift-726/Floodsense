import { AppShell } from "@/components/AppShell";
import { PageIntro } from "@/components/PageIntro";
import { SensorPanel } from "@/components/SensorPanel";

export default function SensorsPage() {
  return (
    <AppShell>
      <PageIntro title="Sensor Network">
        35 simulated river-gauge sensors positioned along the Niger and Benue rivers near real
        Kogi towns, each reporting discharge and water-level readings from the Data
        Scientist&rsquo;s model-driven simulator. In a production deployment these would be
        physical IoT devices on bridges and riverbanks — the &ldquo;eyes&rdquo; that feed the
        flood forecasting model.
      </PageIntro>
      <div className="flex h-[32rem] flex-1 p-3 md:h-auto md:min-h-0">
        <SensorPanel />
      </div>
    </AppShell>
  );
}
