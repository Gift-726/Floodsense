// Placeholder LGA risk levels — a geography-based heuristic (proximity to the
// Niger/Benue confluence and known flood-prone LGAs like Ibaji), NOT real model
// output. Replace with the Data Scientist's LSTM forecast per API_CONTRACT.md
// once available; the map layer only needs { [lga]: level }, so swapping the
// source is a one-line change in MapView.tsx.

export type RiskLevel = "low" | "medium" | "high" | "critical";

export const LGA_RISK: Record<string, RiskLevel> = {
  Lokoja: "critical", // Niger-Benue confluence town
  Ibaji: "critical", // low-lying, historically the worst-hit LGA in Kogi
  Ajaokuta: "high", // Niger riverside
  Idah: "high", // Niger riverside
  Bassa: "high", // Niger riverside, north of Lokoja
  Kogi: "medium",
  Dekina: "medium", // Benue riverside
  Ofu: "medium", // Benue-adjacent
  "Igalamela-Odolu": "medium",
  Omala: "low",
  Olamaboro: "low",
  Ankpa: "low",
  Okene: "low",
  Okehi: "low",
  Adavi: "low",
  "Ogori/Magongo": "low",
  "Kabba/Bunu": "low",
  Ijumu: "low",
  "Mopa-Muro": "low",
  "Yagba East": "low",
  "Yagba West": "low",
};

export const RISK_COLOR: Record<RiskLevel, string> = {
  low: "#0ca30c",
  medium: "#fab219",
  high: "#ec835a",
  critical: "#d03b3b",
};

export const RISK_ORDER: RiskLevel[] = ["low", "medium", "high", "critical"];
