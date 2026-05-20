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
  PiPersonSimpleRun,
  PiTree,
  // Entertainment
  PiFilmReel,
  PiTelevisionSimple,
  PiArmchair,
  PiMicrophoneStage,
  PiHouseLine,
  // Health
  PiHeartbeat,
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
  PiBuilding,
  PiColumns,
  PiCookingPot,
  PiSquaresFour,
  PiDoor,
  PiCpu,
  PiPaintBrush,
  PiPaintRoller,
  PiPipe,
  PiLightbulb,
  PiPlug,
  PiFireExtinguisher,
  PiSolarPanel,
  PiWindmill,
  PiBed,
  PiToilet,
  PiElevator,
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
  kids:        { Icon: PiBaby,                label: "Play Area for Children" },

  // Sports / outdoor
  football:    { Icon: PiSoccerBall,          label: "Football Turf" },
  basketball:  { Icon: PiBasketball,          label: "Basket Ball Court" },
  shuttle:     { Icon: PiTennisBall,          label: "Badminton Court" },
  jogging:     { Icon: PiPersonSimpleRun,     label: "Jogging Track" },
  garden:      { Icon: PiTree,               label: "Landscaped Area" },

  // Entertainment
  cinema:      { Icon: PiFilmReel,            label: "Mini Movie Theatre" },
  cinema24:    { Icon: PiTelevisionSimple,    label: "24-Seater Mini Movie Theatre" },
  amphitheatre:{ Icon: PiArmchair,            label: "Amphitheatre" },
  stage:       { Icon: PiMicrophoneStage,     label: "Open Stage" },
  recreationHall: { Icon: PiHouseLine,        label: "Recreation Hall" },

  // Lifestyle / common
  lobby:       { Icon: PiCouch,               label: "Furnished Lobby" },
  restaurant:  { Icon: PiForkKnife,           label: "Restaurant / Café" },
  library:     { Icon: PiBooks,               label: "Library" },
  road:        { Icon: PiPath,                label: "Paved Internal Roads" },

  // Health & Utilities
  healthClub:  { Icon: PiHeartbeat,           label: "Health Club" },
  generator:   { Icon: PiLightning,           label: "500 W Generator Backup" },
  wifi:        { Icon: PiWifiHigh,            label: "High-Speed Wi-Fi" },
  security:    { Icon: PiShieldCheck,         label: "24x7 Surveillance" },
  parking:     { Icon: PiCar,                 label: "Parking" },
  concierge:   { Icon: PiBellRinging,         label: "Concierge Service" },
  business:    { Icon: PiBriefcase,           label: "Business Suite" },
  pet:         { Icon: PiPawPrint,            label: "Pet Park" },

  // ─── Legacy keys (kept so older project records keep rendering) ──
  gym:         { Icon: PiBarbell,             label: "Open Gym" },
  lounge:      { Icon: PiCouch,               label: "Furnished Lobby" },
  power:       { Icon: PiLightning,           label: "500 W Generator Backup" },
  turf:        { Icon: PiSoccerBall,          label: "Football Turf" },
  park:        { Icon: PiFlower,              label: "Garden / Park" },
};

// ─── Specification icons (admin-pickable) ────────────
export const SPEC_ICONS = {
  foundation:  { Icon: PiColumns,           label: "Foundation" },
  structure:   { Icon: PiBuildings,         label: "Structure" },
  parking:     { Icon: PiCar,               label: "Car Parking" },
  bedroom:     { Icon: PiBed,               label: "Bedroom" },
  kitchen:     { Icon: PiCookingPot,        label: "Kitchen" },
  toilet:      { Icon: PiToilet,            label: "Toilet" },
  doors:       { Icon: PiDoor,              label: "Door" },
  electrical:  { Icon: PiPlug,              label: "Electrical Specifications" },
  plumbing:    { Icon: PiPipe,              label: "Plumbing & Sanitary" },
  elevator:    { Icon: PiElevator,          label: "Elevators" },
  ceiling:     { Icon: PiPaintRoller,       label: "Ceiling Plaster" },
  paint:       { Icon: PiPaintBrush,        label: "Paint" },
  flooring:    { Icon: PiSquaresFour,       label: "Flooring" },
  lighting:    { Icon: PiLightbulb,         label: "Lighting" },
  fire:        { Icon: PiFireExtinguisher,  label: "Fire Safety" },
  tech:        { Icon: PiCpu,               label: "Smart Home" },
  solar:       { Icon: PiSolarPanel,        label: "Solar / Energy" },
  hvac:        { Icon: PiWindmill,          label: "HVAC / Cooling" },
  // Legacy — kept so older records keep rendering correctly
  bath:        { Icon: PiBathtub,           label: "Bathroom" },
};

// Helpers — used by public renderers so unknown icons fall back gracefully.
export const getAmenity = (key) => AMENITY_ICONS[key] || null;
export const getSpec = (key) => SPEC_ICONS[key] || null;
