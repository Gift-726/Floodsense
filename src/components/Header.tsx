import { IconDrop } from "@/components/icons";

export function Header() {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-slate-800 bg-slate-950 px-4">
      <div className="flex items-center gap-2.5">
        <span className="flex h-7 w-7 items-center justify-center rounded-md bg-blue-500/15 text-blue-400">
          <IconDrop className="h-4 w-4" />
        </span>
        <span className="text-sm font-semibold tracking-wide text-slate-100">
          FloodSense <span className="text-blue-400">Kogi</span>
        </span>
        <span className="ml-1 rounded border border-amber-400/30 bg-amber-400/10 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-amber-400">
          Demo data
        </span>
      </div>
      <div className="flex items-center gap-4">
        <span className="hidden text-xs text-slate-500 sm:inline">
          72-hour flood forecast &amp; community alerts
        </span>
        <span className="flex items-center gap-1.5 text-xs text-slate-400">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          System nominal
        </span>
      </div>
    </header>
  );
}
