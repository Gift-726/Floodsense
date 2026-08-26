export function ForecastPanel() {
  return (
    <section className="rounded border border-slate-800 bg-slate-950 p-3">
      <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
        72-Hour Forecast
      </h2>
      <div className="flex h-40 items-center justify-center rounded border border-dashed border-slate-800 text-xs text-slate-600">
        Forecast chart — awaiting /api/forecast data
      </div>
    </section>
  );
}
