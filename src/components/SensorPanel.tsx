export function SensorPanel() {
  return (
    <section className="flex min-h-0 flex-1 flex-col rounded border border-slate-800 bg-slate-950 p-3">
      <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
        Sensor Status (0/35 nodes)
      </h2>
      <div className="flex flex-1 items-center justify-center rounded border border-dashed border-slate-800 text-xs text-slate-600">
        Sensor list — awaiting /api/sensors data
      </div>
    </section>
  );
}
