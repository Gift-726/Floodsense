// Real, well-known Kogi State towns used as anchor points for sensor/community
// markers — approximate town-center coordinates, NOT surveyed sensor or bridge
// GPS pins. GIS Person's sensor_nodes.geojson / communities.geojson (Week 1
// deliverables) replace these with actual field-verified locations.

export type KogiPlace = {
  name: string;
  lga: string;
  river: "Niger" | "Benue";
  lat: number;
  lng: number;
};

export const KOGI_PLACES: KogiPlace[] = [
  { name: "Lokoja", lga: "Lokoja", river: "Niger", lat: 7.7999, lng: 6.7383 },
  { name: "Ajaokuta", lga: "Ajaokuta", river: "Niger", lat: 7.5667, lng: 6.6667 },
  { name: "Idah", lga: "Idah", river: "Niger", lat: 7.1069, lng: 6.7333 },
  { name: "Itobe", lga: "Ibaji", river: "Niger", lat: 7.1667, lng: 6.8667 },
  { name: "Koton Karfe", lga: "Kogi", river: "Niger", lat: 7.9833, lng: 6.6167 },
  { name: "Anyigba", lga: "Dekina", river: "Benue", lat: 7.4833, lng: 7.1667 },
  { name: "Ugwolawo", lga: "Ofu", river: "Benue", lat: 7.3667, lng: 7.1 },
  { name: "Ankpa", lga: "Ankpa", river: "Benue", lat: 7.4004, lng: 7.6194 },
  { name: "Okene", lga: "Okene", river: "Niger", lat: 7.5505, lng: 6.2358 },
  { name: "Kabba", lga: "Kabba/Bunu", river: "Niger", lat: 7.8322, lng: 6.0742 },
];
