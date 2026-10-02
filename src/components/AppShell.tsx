import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { MobileNav } from "@/components/MobileNav";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-slate-900 text-slate-100 md:h-screen">
      <Header />
      <MobileNav />
      <div className="flex flex-1 flex-col md:min-h-0 md:flex-row">
        <Sidebar />
        <div className="flex flex-1 flex-col md:min-h-0">{children}</div>
      </div>
    </div>
  );
}
