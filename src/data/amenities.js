// Re-export from the shared catalog so admin picker keys + public renderers
// stay in lockstep. Add new amenities in src/utils/iconCatalogs.js.
import { AMENITY_ICONS } from "../utils/iconCatalogs";

export const amenityCatalog = Object.fromEntries(
  Object.entries(AMENITY_ICONS).map(([key, { Icon, label }]) => [
    key,
    { label, icon: Icon },
  ])
);
