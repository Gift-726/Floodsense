export function AlertPanel() {
  return (
    <section className="flex h-40 shrink-0 flex-col border-t border-slate-800 bg-slate-950 p-3">
      <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
        Alert Dispatch
      </h2>
      <div className="flex flex-1 items-center justify-center rounded border border-dashed border-slate-800 text-xs text-slate-600">
        Alert dispatch panel &amp; community report feed — awaiting /api/alerts data
      </div>
    </section>
  );
}
