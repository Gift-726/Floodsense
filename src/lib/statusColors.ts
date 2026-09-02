import type { CommunityStatus, SensorStatus } from "@/lib/types";

export const SENSOR_STATUS_COLOR: Record<SensorStatus, string> = {
  online: "var(--status-good)",
  warning: "var(--status-warning)",
  offline: "var(--status-critical)",
};

export const COMMUNITY_STATUS_COLOR: Record<CommunityStatus, string> = {
  monitoring: "#64748b",
  warning: "var(--status-warning)",
  alerted: "var(--status-critical)",
  evacuating: "#8b5cf6",
};
