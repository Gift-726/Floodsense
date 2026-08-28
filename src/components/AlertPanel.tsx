import { IconAlert } from "@/components/icons";

export function AlertPanel() {
  return (
    <section
      id="alert-dispatch"
      className="flex h-40 shrink-0 flex-col border-t border-slate-800 bg-slate-950 p-3 transition-shadow"
    >
      <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
        Alert Dispatch
      </h2>
      <div className="flex flex-1 items-center justify-center gap-2 rounded border border-dashed border-slate-800 text-xs text-slate-600">
        <IconAlert className="h-4 w-4 text-slate-700" />
        Alert dispatch panel &amp; community report feed — arriving in Week 3
      </div>
    </section>
  );
}
