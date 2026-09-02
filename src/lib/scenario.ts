export type Scenario = "t72" | "t24" | "t0";

export const SCENARIOS: { id: Scenario; label: string }[] = [
  { id: "t72", label: "T-72hrs" },
  { id: "t24", label: "T-24hrs" },
  { id: "t0", label: "T-0" },
];

export function isScenario(value: string | null): value is Scenario {
  return value === "t72" || value === "t24" || value === "t0";
}

// How far along the flood timeline each scenario is (0 = calm, 1 = peak).
// Drives every mock generator so switching scenarios visibly moves the
// whole dashboard together, per the Week 3 "scenario switcher" spec.
export const SCENARIO_INTENSITY: Record<Scenario, number> = {
  t72: 0.15,
  t24: 0.55,
  t0: 1,
};
