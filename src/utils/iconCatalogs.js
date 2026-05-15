/**
 * Central icon catalogs — one source of truth used by:
 *   • the admin IconPicker (so admins pick visually instead of memorising keys)
 *   • the public renderers (AmenitiesSection, project detail amenity grid,
 *     SpecGrid)
 *
 * Add a new icon here and it appears in the admin picker AND renders on the
 * public site automatically.
 */

import {
  // Wellness
  PiSwimmingPool,
  PiBarbell,
  PiSparkle,
  PiBathtub,
  PiThermometer,
  PiCloudFog,
  PiHandsPraying,
  // Kids
  PiBaby,
  // Outdoor / sports
  PiSoccerBall,
  PiBasketball,
  PiTennisBall,
  PiFlower,
  // Entertainment
  PiFilmReel,
  PiTelevisionSimple,
  PiArmchair,
  PiMicrophoneStage,
  // Building / lifestyle
  PiCouch,
  PiForkKnife,
  PiBooks,
  PiPath,
  // Utilities
  PiLightning,
  PiWifiHigh,
  PiShieldCheck,
  PiCar,
  PiBellRinging,
  PiBriefcase,
  PiPawPrint,
  // Spec icons
  PiBuildings,
  PiCookingPot,
  PiSquaresFour,
  PiDoor,
  PiCpu,
  PiPaintBrush,
  PiPipe,
  PiLightbulb,
  PiFireExtinguisher,
  PiSolarPanel,
  PiWindmill,
} from "react-icons/pi";

// ─── Amenity icons (admin-pickable) ──────────────────
// Keys are stable identifiers stored in the database — never rename them once
// a project uses them. Labels are display text and can be changed safely.
export const AMENITY_ICONS = {
  // Pools
  pool:        { Icon: PiSwimmingPool,        label: "Swimming Pool" },
  kidsPool:    { Icon: PiSwimmingPool,        label: "Kid's Pool" },

  // Fitness
  openGym:     { Icon: PiBarbell,             label: "Open Gym" },
  indoorGym:   { Icon: PiBarbell,             label: "Indoor Multi Gym" },
  yoga:        { Icon: PiHandsPraying,        label: "Yoga Deck" },

  // Wellness
  jacuzzi:     { Icon: PiBathtub,             label: "Jacuzzi" },
  sauna:       { Icon: PiThermometer,         label: "Sauna" },
  steamBath:   { Icon: PiCloudFog,            label: "Steam Bath" },
  spa:         { Icon: PiSparkle,             label: "Spa" },

  // Kids
  kids:        { Icon: PiBaby,                label: "Children's Play Area" },

  // Sports / outdoor
  football:    { Icon: PiSoccerBall,          label: "Football Turf" },
  basketball:  { Icon: PiBasketball,          label: "Half Basketball Court" },
  shuttle:     { Icon: PiTennisBall,          label: "Shuttle Court" },
  garden:      { Icon: PiFlower,              label: "Garden / Park" },

  // Entertainment
  cinema:      { Icon: PiFilmReel,            label: "Mini Movie Theatre" },
  cinema24:    { Icon: PiTelevisionSimple,    label: "24-Seater Mini Movie Theatre" },
  amphitheatre:{ Icon: PiArmchair,            label: "Amphitheatre" },
  stage:       { Icon: PiMicrophoneStage,     label: "Open Stage" },

  // Lifestyle / common
  lobby:       { Icon: PiCouch,               label: "Elegant Lobby" },
  restaurant:  { Icon: PiForkKnife,           label: "Restaurant / Café" },
  library:     { Icon: PiBooks,               label: "Library" },
  road:        { Icon: PiPath,                label: "Paved Internal Roads" },

  // Utilities
  generator:   { Icon: PiLightning,           label: "500 W Generator Backup" },
  wifi:        { Icon: PiWifiHigh,            label: "High-Speed Wi-Fi" },
  security:    { Icon: PiShieldCheck,         label: "24×7 Security" },
  parking:     { Icon: PiCar,                 label: "Parking" },
  concierge:   { Icon: PiBellRinging,         label: "Concierge Service" },
  business:    { Icon: PiBriefcase,           label: "Business Suite" },
  pet:         { Icon: PiPawPrint,            label: "Pet Park" },

  // ─── Legacy keys (kept so older project records keep rendering) ──
  // Old key → mapped to closest current icon + label. Don't remove these.
  gym:         { Icon: PiBarbell,             label: "Open Gym" },
  lounge:      { Icon: PiCouch,               label: "Elegant Lobby" },
  power:       { Icon: PiLightning,           label: "500 W Generator Backup" },
  turf:        { Icon: PiSoccerBall,          label: "Football Turf" },
};

// ─── Specification icons (admin-pickable) ────────────
export const SPEC_ICONS = {
  structure:   { Icon: PiBuildings,         label: "Structure" },
  kitchen:     { Icon: PiCookingPot,        label: "Kitchen" },
  flooring:    { Icon: PiSquaresFour,       label: "Flooring" },
  bath:        { Icon: PiBathtub,           label: "Bathroom" },
  doors:       { Icon: PiDoor,              label: "Doors / Windows" },
  tech:        { Icon: PiCpu,               label: "Smart Home" },
  paint:       { Icon: PiPaintBrush,        label: "Paint / Finish" },
  plumbing:    { Icon: PiPipe,              label: "Plumbing" },
  lighting:    { Icon: PiLightbulb,         label: "Lighting" },
  fire:        { Icon: PiFireExtinguisher,  label: "Fire Safety" },
  solar:       { Icon: PiSolarPanel,        label: "Solar / Energy" },
  hvac:        { Icon: PiWindmill,          label: "HVAC / Cooling" },
};

// Helpers — used by public renderers so unknown icons fall back gracefully.
export const getAmenity = (key) => AMENITY_ICONS[key] || null;
export const getSpec = (key) => SPEC_ICONS[key] || null;
