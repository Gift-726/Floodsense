"use client";

import { IconCommunity } from "@/components/icons";
import { NAV_ITEMS, jumpTo } from "@/lib/nav";

export function MobileNav() {
  return (
    <nav className="flex shrink-0 gap-1 overflow-x-auto border-b border-slate-800 bg-slate-950 px-2 py-2 md:hidden">
      {NAV_ITEMS.map(({ label, icon: Icon, targetId }) => (
        <button
          key={label}
          type="button"
          onClick={() => jumpTo(targetId)}
          className="flex shrink-0 items-center gap-1.5 rounded px-3 py-1.5 text-xs text-slate-400 active:bg-slate-800"
        >
          <Icon className="h-3.5 w-3.5" />
          {label}
        </button>
      ))}
      <a
        href="/community"
        className="flex shrink-0 items-center gap-1.5 rounded px-3 py-1.5 text-xs text-slate-400 active:bg-slate-800"
      >
        <IconCommunity className="h-3.5 w-3.5" />
        Community
      </a>
    </nav>
  );
}
