// Types for the real FloodSense model output (src/data/model/forecast.json),
// handed off by the Data Scientist. See docs/MODEL_HANDOFF.md for the full
// contract — in particular: daily resolution, 7 fixed horizons, forecasts
// river discharge at the Lokoja GRDC point (not per-LGA water depth), and
// the independent 2022 GRDC event backtest is NOT_COMPUTABLE (missing real
// observations) — do not claim a "flagged Critical X hours before peak
// flooding" number anywhere in the UI or video script.

export type WarningState = "GREEN" | "YELLOW" | "RED";

export type ForecastHorizonPoint = {
  lead_days: number;
  target_date: string;
  predicted_discharge_m3s: number;
  prediction_lower_m3s: number;
  prediction_upper_m3s: number;
  prediction_interval_nominal_coverage: number;
  flood_probability: number;
  operating_probability_threshold: number;
  warning_state: WarningState;
  training_alert_threshold_m3s: number;
};

export type ModelForecast = {
  system: string;
  model: {
    name: string;
    version: string;
    resolution: string;
    target: string;
    monitoring_point: string;
    feature_count: number;
    training_alert_threshold_m3s: number;
    alert_quantile: number;
    exogenous_availability_lag_days: number;
    minimum_consecutive_daily_rows: number;
  };
  forecast_origin: string;
  forecasts: ForecastHorizonPoint[];
};

export type ModelSensorReading = {
  sensor_id: string;
  sensor_name: string;
  simulated_discharge_m3s: number;
  simulated_water_level_m: number;
  scenario: string;
  data_type: string;
};

export type ModelSensorSnapshot = {
  system: string;
  data_type: string;
  source: string;
  timestamp: string;
  sensor_count: number;
  scenario: string;
  model_lead_day: number;
  daily_model_flood_probability: number;
  flood_threshold_m3s: number;
  sensors: ModelSensorReading[];
};

// The three horizons surfaced as the dashboard's "outlook" switcher — picked
// to match model_handoff.md's own framing (t+1 immediate, t+7 short-term
// planning; 14-30 days is explicitly called an "extended outlook" rather
// than equivalent operational performance, so t+30 is labeled as such).
export type FocusHorizon = 1 | 7 | 30;

export const FOCUS_HORIZONS: { id: FocusHorizon; label: string }[] = [
  { id: 1, label: "T+1 Day" },
  { id: 7, label: "T+7 Days" },
  { id: 30, label: "T+30 Days (outlook)" },
];

export function isFocusHorizon(value: string | null): value is `${FocusHorizon}` {
  return value === "1" || value === "7" || value === "30";
}

export function pickHorizon(forecast: ModelForecast, leadDays: number): ForecastHorizonPoint | undefined {
  return forecast.forecasts.find((f) => f.lead_days === leadDays);
}

// How much to bump a geography-based LGA risk level, driven by the model's
// own calibrated warning_state at the focused horizon — not a fabricated
// probability cutoff.
export function bumpForWarningState(state: WarningState | undefined): number {
  if (state === "RED") return 2;
  if (state === "YELLOW") return 1;
  return 0;
}
