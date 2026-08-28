import { IconAlert, IconCommunity, IconDashboard, IconSensor } from "@/components/icons";

const NAV_ITEMS = [
  { label: "Dashboard", icon: IconDashboard, active: true },
  { label: "Alerts", icon: IconAlert, active: false },
  { label: "Community", icon: IconCommunity, active: false },
  { label: "Sensors", icon: IconSensor, active: false },
];

export function Sidebar() {
  return (
    <aside className="hidden w-48 shrink-0 flex-col justify-between border-r border-slate-800 bg-slate-950 p-3 sm:flex">
      <nav className="flex flex-col gap-1">
        {NAV_ITEMS.map(({ label, icon: Icon, active }) => (
          <span
            key={label}
            className={`flex items-center gap-2.5 rounded px-3 py-2 text-sm transition-colors ${
              active
                ? "border-l-2 border-blue-500 bg-slate-800/80 font-medium text-slate-100"
                : "border-l-2 border-transparent text-slate-400 hover:bg-slate-900 hover:text-slate-200"
            }`}
          >
            <Icon className="h-4 w-4 shrink-0" />
            {label}
          </span>
        ))}
      </nav>
      <p className="px-3 text-[11px] leading-snug text-slate-600">
        Kogi State &middot; v0.1.0-skeleton
      </p>
    </aside>
  );
}
