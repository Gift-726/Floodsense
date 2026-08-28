// Shapes mirror API_CONTRACT.md — keep both in sync.

export type ForecastHour = {
  hour: number;
  probability: number;
  confidence_low: number;
  confidence_high: number;
};

export type ForecastResponse = {
  scenario: "t72" | "t24" | "t0";
  generated_at: string;
  lagdo_risk_flag: boolean;
  hours: ForecastHour[];
};

export type SensorStatus = "online" | "warning" | "offline";
export type SensorTrend = "rising" | "stable" | "falling";

export type SensorNode = {
  node_id: string;
  name: string;
  lga: string;
  river: string;
  lat: number;
  lng: number;
  status: SensorStatus;
  reading_m: number;
  trend: SensorTrend;
  last_updated: string;
};

export type SensorsResponse = {
  updated_at: string;
  nodes: SensorNode[];
};

export type CommunitySeverity = "low" | "medium" | "high" | "critical";
export type CommunityStatus = "monitoring" | "warning" | "alerted" | "evacuating";

export type Community = {
  name: string;
  lga: string;
  severity: CommunitySeverity;
  est_flood_arrival_hours: number;
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
