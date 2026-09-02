import fs from "node:fs";
import path from "node:path";
import { KOGI_PLACES } from "@/lib/kogiPlaces";
import { LGA_RISK, RISK_ORDER, type RiskLevel } from "@/lib/mockRisk";
import { SCENARIO_INTENSITY, type Scenario } from "@/lib/scenario";
import type { AlertLogEntry, Community, CommunityReport, CommunityStatus } from "@/lib/types";

// Demo state persisted to a local JSON file rather than kept purely in
// memory: Next.js dev mode can reinitialize an API route's module graph the
// first time a given route is hit, which would silently reset plain
// module-scope arrays. A file survives that. This is still a single-process,
// single-file demo store — a real deployment needs a database.
const STATE_FILE = path.join(process.cwd(), ".demo-state.json");

type DemoState = {
  alertLog: AlertLogEntry[];
  reports: CommunityReport[];
  dispatched: string[];
};

function readState(): DemoState {
  try {
    const raw = fs.readFileSync(STATE_FILE, "utf8");
    const parsed = JSON.parse(raw);
    return {
      alertLog: parsed.alertLog ?? [],
      reports: parsed.reports ?? [],
      dispatched: parsed.dispatched ?? [],
    };
  } catch {
    return { alertLog: [], reports: [], dispatched: [] };
  }
}

function writeState(state: DemoState) {
  try {
    fs.writeFileSync(STATE_FILE, JSON.stringify(state), "utf8");
  } catch {
    // best-effort — a filesystem write failure (e.g. read-only serverless
    // deployment) just means state won't persist across route reloads
  }
}

function severityForScenario(base: RiskLevel, intensity: number): RiskLevel {
  const bump = intensity >= 1 ? 2 : intensity >= 0.5 ? 1 : 0;
  const idx = Math.min(RISK_ORDER.length - 1, RISK_ORDER.indexOf(base) + bump);
  return RISK_ORDER[idx];
}

function statusFor(severity: RiskLevel, name: string, scenario: Scenario, dispatched: Set<string>): CommunityStatus {
  if (dispatched.has(name)) {
    return severity === "critical" && scenario === "t0" ? "evacuating" : "alerted";
  }
  if (severity === "critical" || severity === "high") return "warning";
  return "monitoring";
}

export function getCommunities(scenario: Scenario): Community[] {
  const intensity = SCENARIO_INTENSITY[scenario];
  const dispatched = new Set(readState().dispatched);
  return KOGI_PLACES.map((place, i) => {
    const base = LGA_RISK[place.lga] ?? "low";
    const severity = severityForScenario(base, intensity);
    return {
      name: place.name,
      lga: place.lga,
      severity,
      est_flood_arrival_hours: Math.max(1, Math.round(72 - i * 6 - intensity * 48)),
      population: 5000 + i * 1200,
      status: statusFor(severity, place.name, scenario, dispatched),
    };
  });
}

export function getAlertLog(): AlertLogEntry[] {
  return readState().alertLog;
}

export function getReports(): CommunityReport[] {
  return readState().reports;
}

export function dispatchAlerts(scenario: Scenario): { dispatchedNow: string[]; alertLog: AlertLogEntry[] } {
  const state = readState();
  const dispatchedSet = new Set(state.dispatched);
  const communities = getCommunities(scenario);
  const dispatchedNow: string[] = [];

  for (const c of communities) {
    if (dispatchedSet.has(c.name)) continue;
    if (c.severity !== "high" && c.severity !== "critical") continue;

    dispatchedSet.add(c.name);
    dispatchedNow.push(c.name);
    const smsCount = 200 + Math.round((c.population % 1000) * 0.6);
    state.alertLog.unshift({
      time: new Date().toISOString(),
      community: c.name,
      message: `Alert dispatched to ${c.name} — IVR initiated in Igala/Ebira, SMS sent to ${smsCount} numbers`,
    });
  }

  state.dispatched = Array.from(dispatchedSet);
  writeState(state);
  return { dispatchedNow, alertLog: state.alertLog };
}

export function addReport(community: string, waterLevel: string): CommunityReport[] {
  const state = readState();
  const recent = state.reports.find(
    (r) => r.community === community && r.water_level === waterLevel && Date.now() - Date.parse(r.time) < 5 * 60_000
  );
  if (recent) {
    recent.reporter_count += 1;
    recent.time = new Date().toISOString();
  } else {
    state.reports.unshift({
      community,
      time: new Date().toISOString(),
      water_level: waterLevel,
      reporter_count: 1,
    });
  }
  writeState(state);
  return state.reports;
}

export function resetDemoState() {
  writeState({ alertLog: [], reports: [], dispatched: [] });
}
