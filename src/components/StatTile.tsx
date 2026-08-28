type StatTileProps = {
  label: string;
  value: string;
  caption?: string;
  accent?: "neutral" | "good" | "warning" | "serious" | "critical";
};

const ACCENT_DOT: Record<NonNullable<StatTileProps["accent"]>, string> = {
  neutral: "bg-slate-600",
  good: "bg-[var(--status-good)]",
  warning: "bg-[var(--status-warning)]",
  serious: "bg-[var(--status-serious)]",
  critical: "bg-[var(--status-critical)]",
};

export function StatTile({ label, value, caption, accent = "neutral" }: StatTileProps) {
  return (
    <div className="flex-1 rounded border border-slate-800 bg-slate-950 px-4 py-3">
      <div className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-slate-500">
        <span className={`h-1.5 w-1.5 rounded-full ${ACCENT_DOT[accent]}`} />
        {label}
      </div>
      <div className="mt-1.5 text-2xl font-semibold text-slate-100">{value}</div>
      {caption && <div className="mt-0.5 text-xs text-slate-500">{caption}</div>}
    </div>
  );
}
