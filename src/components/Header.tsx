export function Header() {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-slate-800 bg-slate-950 px-4">
      <div className="flex items-center gap-2">
        <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
        <span className="text-sm font-semibold tracking-wide text-slate-100">
          FloodSense <span className="text-blue-400">Kogi</span>
        </span>
      </div>
      <span className="text-xs text-slate-500">72-hour flood forecast &amp; community alerts</span>
    </header>
  );
}
