"use client";

import { useState } from "react";
import { KOGI_PLACES } from "@/lib/kogiPlaces";

const WATER_LEVELS = [
  { key: "1", label: "Below ankle" },
  { key: "2", label: "Knee height" },
  { key: "3", label: "Waist height" },
  { key: "4", label: "Compound flooded" },
];

type Screen = "alert" | "menu" | "confirmation";

export default function CommunityPage() {
  const [community, setCommunity] = useState(KOGI_PLACES[0].name);
  const [screen, setScreen] = useState<Screen>("alert");
  const [receiptConfirmed, setReceiptConfirmed] = useState(false);
  const [submittedLevel, setSubmittedLevel] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function resetSimulation(nextCommunity?: string) {
    if (nextCommunity) setCommunity(nextCommunity);
    setScreen("alert");
    setReceiptConfirmed(false);
    setSubmittedLevel(null);
  }

  async function submitReport(levelLabel: string) {
    setSubmitting(true);
    try {
      await fetch("/api/alerts/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ community, water_level: levelLabel }),
      });
      setSubmittedLevel(levelLabel);
      setScreen("confirmation");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center gap-4 bg-slate-900 p-6">
      <div className="w-full max-w-xs">
        <label className="mb-1 block text-xs text-slate-400">Simulating alert for</label>
        <select
          value={community}
          onChange={(e) => resetSimulation(e.target.value)}
          className="w-full rounded border border-slate-700 bg-slate-800 px-2 py-1.5 text-sm text-slate-100"
        >
          {KOGI_PLACES.map((p) => (
            <option key={p.name} value={p.name}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      <div className="w-full max-w-xs overflow-hidden rounded-2xl border-4 border-slate-700 bg-slate-950 shadow-2xl">
        <div className="min-h-[220px] bg-[#1a1a1a] p-4 font-mono text-[13px] leading-relaxed text-[#8fd68f]">
          {screen === "alert" && (
            <>
              <p className="mb-3">
                FLOOD ALERT — Kogi SEMA.
                <br />
                Severe flooding expected in <strong>{community}</strong> within 24hrs.
                <br />
                Evacuate to designated high ground.
              </p>
              {receiptConfirmed ? (
                <p className="text-[#c8f0c8]">
                  Receipt confirmed. Reply 2 to report water level.
                </p>
              ) : (
                <p>
                  1. Confirm receipt
                  <br />
                  2. Report water level
                </p>
              )}
            </>
          )}

          {screen === "menu" && (
            <>
              <p className="mb-3">Select current water level:</p>
              {WATER_LEVELS.map((lvl) => (
                <p key={lvl.key}>
                  {lvl.key}. {lvl.label}
                </p>
              ))}
              <p>0. Back</p>
            </>
          )}

          {screen === "confirmation" && (
            <>
              <p className="mb-2">Report received. Thank you. Stay safe.</p>
              <p className="text-[#c8f0c8]">
                Logged: {submittedLevel} at {community}.
              </p>
            </>
          )}
        </div>

        <div className="grid grid-cols-3 gap-px bg-slate-800 p-px">
          {screen === "alert" &&
            ["1", "2"].map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => {
                  if (key === "1") setReceiptConfirmed(true);
                  else setScreen("menu");
                }}
                className="bg-slate-900 py-3 text-sm font-semibold text-slate-100 active:bg-slate-800"
              >
                {key}
              </button>
            ))}
          {screen === "menu" &&
            [...WATER_LEVELS.map((l) => l.key), "0"].map((key) => (
              <button
                key={key}
                type="button"
                disabled={submitting}
                onClick={() => {
                  if (key === "0") setScreen("alert");
                  else submitReport(WATER_LEVELS.find((l) => l.key === key)!.label);
                }}
                className="bg-slate-900 py-3 text-sm font-semibold text-slate-100 active:bg-slate-800 disabled:opacity-50"
              >
                {key}
              </button>
            ))}
          {screen === "confirmation" && (
            <button
              type="button"
              onClick={() => resetSimulation()}
              className="col-span-3 bg-slate-900 py-3 text-sm font-semibold text-blue-400 active:bg-slate-800"
            >
              Start over
            </button>
          )}
        </div>
      </div>

      <a href="/" className="text-xs text-slate-500 underline">
        &larr; Back to dashboard
      </a>
    </div>
  );
}
