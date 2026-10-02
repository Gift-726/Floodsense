"use client";

import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "@/lib/nav";

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="flex shrink-0 gap-1 overflow-x-auto border-b border-slate-800 bg-slate-950 px-2 py-2 md:hidden">
      {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
        const active = href === "/" ? pathname === "/" : pathname?.startsWith(href);
        return (
          <a
            key={label}
            href={href}
            className={`flex shrink-0 items-center gap-1.5 rounded px-3 py-1.5 text-xs active:bg-slate-800 ${
              active ? "bg-slate-800 font-medium text-slate-100" : "text-slate-400"
            }`}
          >
            <Icon className="h-3.5 w-3.5" />
            {label}
          </a>
        );
      })}
    </nav>
  );
}
