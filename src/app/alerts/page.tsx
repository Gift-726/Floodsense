"use client";

import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { PageIntro } from "@/components/PageIntro";
import { AlertDispatchPanel } from "@/components/AlertDispatchPanel";
import { CommunityReportFeed } from "@/components/CommunityReportFeed";
import { HorizonSwitcher } from "@/components/HorizonSwitcher";
import type { FocusHorizon } from "@/lib/model";

export default function AlertsPage() {
  const [horizon, setHorizon] = useState<FocusHorizon>(7);

  return (
    <AppShell>
      <PageIntro title="Alert Dispatch">
        The 10 highest-risk communities in Kogi State, ranked by current flood severity. When a
        community&rsquo;s severity reaches High or Critical, <strong>Dispatch Alert</strong>{" "}
        simulates SEMA (the state emergency agency) broadcasting a warning — IVR phone calls and
        SMS in Igala/Ebira — to everyone in that zone at once, without needing a smartphone.
      </PageIntro>
      <div className="flex flex-1 flex-col gap-3 p-3 md:min-h-0 md:flex-row">
        <div className="flex min-h-0 flex-1 flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500">
              Severity below is driven by the model&rsquo;s forecast at the horizon you pick:
            </span>
            <HorizonSwitcher horizon={horizon} onChange={setHorizon} />
          </div>
          <AlertDispatchPanel horizon={horizon} />
        </div>
        <CommunityReportFeed horizon={horizon} />
      </div>
    </AppShell>
  );
}
