"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "@/lib/nav";
import { IconChevronsLeft } from "@/components/icons";

const COLLAPSE_KEY = "floodsense-sidebar-collapsed";

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setCollapsed(localStorage.getItem(COLLAPSE_KEY) === "1");
    setHydrated(true);
  }, []);

  function toggle() {
    setCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem(COLLAPSE_KEY, next ? "1" : "0");
      return next;
    });
  }

  return (
    <aside
      className={`hidden shrink-0 flex-col justify-between border-r border-slate-800 bg-slate-950 transition-[width] duration-150 md:flex ${
        collapsed ? "w-14" : "w-48"
      } ${hydrated ? "" : "invisible"}`}
    >
      <nav className="flex flex-col gap-1 p-3">
        {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
          const active = href === "/" ? pathname === "/" : pathname?.startsWith(href);
          return (
            <a
              key={label}
              href={href}
              title={collapsed ? label : undefined}
              className={`flex items-center gap-2.5 rounded border-l-2 py-2 text-sm transition-colors ${
                collapsed ? "justify-center px-0" : "px-3"
              } ${
                active
                  ? "border-blue-500 bg-slate-800/80 font-medium text-slate-100"
                  : "border-transparent text-slate-400 hover:bg-slate-900 hover:text-slate-200"
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {!collapsed && label}
            </a>
          );
        })}
      </nav>
      <div className="border-t border-slate-800 p-3">
        {!collapsed && (
          <p className="mb-2 px-0 text-[11px] leading-snug text-slate-600">
            Kogi State &middot; v0.1.0-skeleton
          </p>
        )}
        <button
          type="button"
          onClick={toggle}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className={`flex w-full items-center gap-2 rounded py-1.5 text-slate-500 hover:bg-slate-900 hover:text-slate-300 ${
            collapsed ? "justify-center px-0" : "justify-start px-2"
          }`}
        >
          <IconChevronsLeft className={`h-3.5 w-3.5 transition-transform ${collapsed ? "rotate-180" : ""}`} />
          {!collapsed && <span className="text-xs">Collapse</span>}
        </button>
      </div>
    </aside>
  );
}
