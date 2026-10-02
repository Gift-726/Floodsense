"use client";

import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "@/lib/nav";

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-48 shrink-0 flex-col justify-between border-r border-slate-800 bg-slate-950 p-3 md:flex">
      <nav className="flex flex-col gap-1">
        {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
          const active = href === "/" ? pathname === "/" : pathname?.startsWith(href);
          return (
            <a
              key={label}
              href={href}
              className={`flex items-center gap-2.5 rounded border-l-2 px-3 py-2 text-sm transition-colors ${
                active
                  ? "border-blue-500 bg-slate-800/80 font-medium text-slate-100"
                  : "border-transparent text-slate-400 hover:bg-slate-900 hover:text-slate-200"
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </a>
          );
        })}
      </nav>
      <p className="px-3 text-[11px] leading-snug text-slate-600">
        Kogi State &middot; v0.1.0-skeleton
      </p>
    </aside>
  );
}
