# FloodSense Kogi — Model Handoff

## 1. What this model does

FloodSense produces daily forecasts of future
`grdc_discharge` at the GRDC monitoring point.

It produces forecasts for:

- 1 day
- 3 days
- 7 days
- 14 days
- 16 days
- 21 days
- 30 days

The model operates at **daily resolution**.

It is not an hourly model.

---

## 2. Current model contract

Model version:

`corrected_causal_61_feature_h30`

Canonical target:

`grdc_discharge`

Feature count:

`61`

Training period:

`2010 – 2021`

Validation period:

`2022 – 2023`

Locked held-out test:

`2024 – 2025`

Training flood threshold:

`17414.65 m³/s`

Threshold definition:

Training-only p90 of `grdc_discharge`.

Exogenous availability lag:

`1 day`

Minimum inference history:

`61 consecutive daily observations`

---

## 3. Important model restrictions

The following must NOT be introduced as model predictors:

- `river_discharge`
- `flood_severity`

`grdc_discharge` remains the canonical target.

The GIS layer must not modify or reinterpret the model's
predicted discharge values.

---

## 4. What the GIS system receives

The GIS/software layer should consume:

`forecast.json`

The schema is defined in:

`forecast_schema.json`

A tabular version is also provided:

`latest_forecast.csv`

The GIS system does not need to open the research notebook
to display the forecast.

---

## 5. Forecast fields

Each forecast contains:

- `lead_days`
- `target_date`
- `predicted_discharge_m3s`
- `prediction_lower_m3s`
- `prediction_upper_m3s`
- `flood_probability`
- `operating_probability_threshold`
- `warning_state`
- `training_alert_threshold_m3s`

---

## 6. How GIS should use the model

The model produces the hydrological warning signal.

GIS provides the spatial context.

Therefore:

FloodSense model
        ↓
forecast.json
        ↓
GIS application
        ↓
Kogi spatial layers
        ↓
map/dashboard/alerts

The GIS layer should combine the forecast with:

- Kogi LGA boundaries
- communities
- sensor locations
- flood extent/scenario layers
- evacuation routes

The model itself does NOT claim to predict water depth
for every LGA.

The model predicts future discharge at the monitoring point.

Spatial interpretation must therefore remain clearly separated
from the hydrological forecast.

---

## 7. Operational warning horizons

The primary operational warning horizons are:

### t+1
Immediate/next-day forecast.

### t+3
Short-term preparedness warning.

### t+7
Short-term planning/outlook.

The 14-, 16-, 21- and 30-day forecasts should be presented
as an extended outlook rather than as equivalent operational
event-detection performance.

---

## 8. Prediction intervals

The lower and upper discharge values are empirical
validation-residual prediction intervals.

They have nominal central coverage of 90%.

They do NOT constitute a guarantee that future observations
will fall inside the interval.

---

## 9. 2022 event evaluation

The independent 2022 GRDC event evaluation is retained as:

`NOT_COMPUTABLE`

when canonical GRDC observations are unavailable.

Do not substitute:

- `river_discharge`
- `flood_severity`
- interpolated values
- model predictions

for missing GRDC observations.

---

## 10. What the GIS developer should NOT do

Do not:

- retrain the model
- change the flood threshold
- change the feature list
- use `river_discharge` as a predictor
- use `flood_severity` as a predictor
- convert daily predictions into hourly predictions
- claim the model directly predicts LGA water depth
- invent spatial flood probabilities from the discharge forecast

---

## 11. Current integration interface

For a software implementation, the recommended interface is:

`GET /api/forecast`

which should return the contents of:

`forecast.json`

The dashboard can then update its forecast display whenever
a new daily forecast is generated.

---

## 12. Competition demonstration flow

Recommended demonstration:

1. New daily observations enter FloodSense.
2. The production model generates the seven horizons.
3. `forecast.json` is updated.
4. Dashboard retrieves the forecast.
5. GIS map displays the current warning state.
6. Forecast chart displays discharge and uncertainty.
7. Alert module uses the warning state.
8. Community/USSD simulator displays the same warning signal.

This preserves one model output across all product components.