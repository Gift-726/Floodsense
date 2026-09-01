# IEEE Challenge — Flood Prediction Data Pipeline

A data processing pipeline designed to aggregate, clean, and merge multi-source hydrologic and remote sensing data. The pipeline constructs a daily time-series dataset (2010–2023) covering two target catchments in the Niger–Benue river system to support flood prediction models.

---

## Overview

The notebook extracts, spatial-clips, and merges daily precipitation, soil moisture, and river discharge data across six processing phases:

| Part | Catchment | Data Sources | Purpose / Description |
| --- | --- | --- | --- |
| **Part_1** | Kogi State | CHIRPS | Primary daily rainfall for local LSTM features.|
| **Part_2** | Niger–Benue Basin / Kogi | NASA GPM IMERG | High-resolution satellite rainfall for validation/backfilling.|
| **Part_3** | Kogi State | NASA SMAP (SPL3SMP) | Daily volumetric surface soil moisture.|
| **Part_4** | Lagdo Dam Catchment | CHIRPS, IMERG, SMAP | Upstream hydrologic features to generate `lagdo_risk_flag` proxies. |
| **Part_5** | Lokoja | Open-Meteo Flood API | Target river discharge rates ($m^3/s$). |
| **Part_6** | Global / Output | Integrated Merge | Final dataset consolidation and gap backfilling. |

---

## Output Dataset Schema

The final output file is **`IEEE flood prediction data.csv`**. It includes the following features:

| Column Name | Type | Source | Description |
| --- | --- | --- | --- |
| `date` | `datetime` | System | Daily timestamp (2010-01-01 to 2023-12-31). |
| `rainfall_mm_chirps_kogi` | `float` | CHIRPS | Daily mean precipitation over Kogi State bounding box. |
| `rainfall_mm_imerg_kogi` | `float` | GPM IMERG | Daily mean precipitation over Kogi State (used for backfilling). |
| `soil_moisture_kogi` | `float` | NASA SMAP | Mean surface soil moisture over Kogi State. |
| `has_soil_moisture_kogi` | `bool` | Pipeline Flag | `True` if SMAP data was available; `False` if mean-imputed. |
| `rainfall_source_chirps_kogi` | `bool` | Pipeline Flag | `True` if CHIRPS was used; `False` if backfilled by IMERG. |
| `river_discharge` | `float` | Open-Meteo API | Daily discharge rate at Lokoja (Lat: 7.80, Lon: 6.74). |
| `rainfall_mm_chirps_lagdo` | `float` | CHIRPS | Daily precipitation over upstream Lagdo Dam catchment. |
| `rainfall_mm_imerg_lagdo` | `float` | GPM IMERG | Upstream IMERG daily rainfall. |
| `soil_moisture_lagdo` | `float` | NASA SMAP | Upstream soil moisture over Lagdo Dam catchment. |
| `has_soil_moisture_lagdo` | `bool` | Pipeline Flag | `True` if upstream SMAP data was available. |
| `rainfall_source_chirps_lagdo` | `bool` | Pipeline Flag | `True` if upstream CHIRPS was used; `False` if backfilled. |

---

## Prerequisites & Installation

### Core Dependencies

Install required libraries via `pip`:

```bash
pip install requests rasterio numpy pandas tqdm earthaccess xarray h5netcdf netCDF4 --break-system-packages

```

### External Credentials

1. **NASA Earthdata Account**: Required for accessing IMERG (Part 2/4b) and SMAP (Part 3/4c) datasets.


2. **GES DISC Approval**: Log into [Earthdata Profile](https://urs.earthdata.nasa.gov/profile), navigate to **Applications -> Authorized Apps**, search for **`NASA GESDISC DATA ARCHIVE`**, and grant access.



---

## Spatial Configurations

The processing pipeline utilizes geographic bounding boxes `(min_lon, min_lat, max_lon, max_lat)` to clip global rasters:

* **Kogi State Box**: `(5.40, 6.30, 7.80, 8.90)`

* **Niger–Benue Basin Box**: `(4.5, 6.0, 9.5, 10.5)`

* **Lagdo Dam Catchment Box**: `(11.0, 6.5, 14.5, 10.5)` (Covers Adamawa/Taraba, NG & N. Cameroon)
