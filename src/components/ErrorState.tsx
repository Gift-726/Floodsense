export function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-1.5 px-2 text-center">
      <p className="text-xs text-[var(--status-critical)]">Couldn&apos;t load data — {message}</p>
      <button
        type="button"
        onClick={onRetry}
        className="rounded border border-slate-700 px-2 py-0.5 text-[11px] text-slate-300 hover:bg-slate-800"
      >
        Retry
      </button>
    </div>
  );
}
