// Shapes mirror API_CONTRACT.md — keep both in sync.
// Forecast shapes live in lib/model.ts (real FloodSense model output).

export type SensorNode = {
  node_id: string;
  name: string;
  lga: string;
  river: string;
  lat: number;
  lng: number;
  scenario: string;
  discharge_m3s: number;
  water_level_m: number;
};

export type SensorsResponse = {
  updated_at: string;
  model_lead_day: number;
  daily_model_flood_probability: number;
  nodes: SensorNode[];
};

export type CommunitySeverity = "low" | "medium" | "high" | "critical";
export type CommunityStatus = "monitoring" | "warning" | "alerted" | "evacuating";

export type Community = {
  name: string;
  lga: string;
  severity: CommunitySeverity;
  population: number;
  status: CommunityStatus;
};

export type AlertLogEntry = {
  time: string;
  community: string;
  message: string;
};

export type CommunityReport = {
  community: string;
  time: string;
  water_level: string;
  reporter_count: number;
};

export type AlertsResponse = {
  updated_at: string;
  communities: Community[];
  alert_log: AlertLogEntry[];
  reports: CommunityReport[];
};
