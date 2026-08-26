const NAV_ITEMS = ["Dashboard", "Alerts", "Community", "Sensors"];

export function Sidebar() {
  return (
    <aside className="hidden w-48 shrink-0 border-r border-slate-800 bg-slate-950 p-3 sm:block">
      <nav className="flex flex-col gap-1">
        {NAV_ITEMS.map((item, i) => (
          <span
            key={item}
            className={`rounded px-3 py-2 text-sm ${
              i === 0
                ? "bg-slate-800 font-medium text-slate-100"
                : "text-slate-400"
            }`}
          >
            {item}
          </span>
        ))}
      </nav>
    </aside>
  );
}
