import { IconAlert, IconDashboard, IconSensor } from "@/components/icons";

export const NAV_ITEMS = [
  { label: "Dashboard", icon: IconDashboard, targetId: "dashboard-map" },
  { label: "Alerts", icon: IconAlert, targetId: "alert-dispatch" },
  { label: "Sensors", icon: IconSensor, targetId: "sensor-status" },
];

export function jumpTo(targetId: string) {
  const el = document.getElementById(targetId);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
  el.classList.add("ring-2", "ring-blue-500");
  window.setTimeout(() => el.classList.remove("ring-2", "ring-blue-500"), 1000);
}
