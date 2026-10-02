export function PageIntro({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-b border-slate-800 bg-slate-900 px-4 py-3">
      <h1 className="text-sm font-semibold text-slate-100">{title}</h1>
      <p className="mt-1 max-w-2xl text-xs leading-relaxed text-slate-400">{children}</p>
    </div>
  );
}
