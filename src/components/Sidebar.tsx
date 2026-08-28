"use client";

import { IconAlert, IconCommunity, IconDashboard, IconSensor } from "@/components/icons";

const NAV_ITEMS = [
  { label: "Dashboard", icon: IconDashboard, targetId: "dashboard-map" },
  { label: "Alerts", icon: IconAlert, targetId: "alert-dispatch" },
  { label: "Sensors", icon: IconSensor, targetId: "sensor-status" },
];

function jumpTo(targetId: string) {
  const el = document.getElementById(targetId);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "nearest" });
  el.classList.add("ring-2", "ring-blue-500");
  window.setTimeout(() => el.classList.remove("ring-2", "ring-blue-500"), 1000);
}

export function Sidebar() {
  return (
    <aside className="hidden w-48 shrink-0 flex-col justify-between border-r border-slate-800 bg-slate-950 p-3 sm:flex">
      <nav className="flex flex-col gap-1">
        {NAV_ITEMS.map(({ label, icon: Icon, targetId }) => (
          <button
            key={label}
            type="button"
            onClick={() => jumpTo(targetId)}
            className="flex items-center gap-2.5 rounded border-l-2 border-transparent px-3 py-2 text-left text-sm text-slate-400 transition-colors hover:border-blue-500 hover:bg-slate-900 hover:text-slate-100"
          >
            <Icon className="h-4 w-4 shrink-0" />
            {label}
          </button>
        ))}
        <span
          className="flex cursor-not-allowed items-center gap-2.5 rounded border-l-2 border-transparent px-3 py-2 text-sm text-slate-600"
          title="The USSD community simulator ships in Week 3"
        >
          <IconCommunity className="h-4 w-4 shrink-0" />
          Community
          <span className="ml-auto rounded bg-slate-800 px-1.5 py-0.5 text-[10px] text-slate-500">
            Wk 3
          </span>
        </span>
      </nav>
      <p className="px-3 text-[11px] leading-snug text-slate-600">
        Kogi State &middot; v0.1.0-skeleton
      </p>
    </aside>
  );
}
