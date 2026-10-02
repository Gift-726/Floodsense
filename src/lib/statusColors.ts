import type { CommunityStatus } from "@/lib/types";

export const SENSOR_SCENARIO_COLOR: Record<string, string> = {
  NORMAL: "var(--status-good)",
  WARNING: "var(--status-warning)",
  CRITICAL: "var(--status-critical)",
  FLOOD: "var(--status-critical)",
};
export const SENSOR_SCENARIO_DEFAULT_COLOR = "#64748b";

export const COMMUNITY_STATUS_COLOR: Record<CommunityStatus, string> = {
  monitoring: "#64748b",
  warning: "var(--status-warning)",
  alerted: "var(--status-critical)",
  evacuating: "#8b5cf6",
};
