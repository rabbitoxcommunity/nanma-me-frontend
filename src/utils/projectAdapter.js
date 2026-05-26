/**
 * Maps a backend Project document into the shape the public-site components
 * already expect (so we don't have to rewrite every card / detail section).
 */

export const STATUS_LABELS = {
  ongoing: "Ongoing",
  ready: "Ready to Move In",
  completed: "Completed",
  upcoming: "New Launch",
};

export const PROJECT_STATUSES = [
  { key: "all", label: "All Projects" },
  { key: "ongoing", label: "Ongoing" },
  { key: "ready", label: "Ready to Move In" },
  { key: "completed", label: "Completed" },
  { key: "upcoming", label: "New Launch" },
];

const PLACEHOLDER =
  "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&q=80";

export function adaptProject(p) {
  if (!p) return null;
  const cover = p.featuredImage?.url || p.galleryImages?.[0]?.url || PLACEHOLDER;
  const gallery = (p.galleryImages || []).map((g) => g.url).filter(Boolean);
  // Fall back to cover so detail page hero always has at least one image
  const galleryWithFallback = gallery.length ? gallery : [cover];
  const pinShort = (p.location || "").split(",")[0]?.trim() || "";

  // Legacy guard — older records may still have `units` as an array of unit
  // objects (from before the field was renamed to `inventory`). Treat the
  // STRING-typed `units` (e.g. "184 Apartments") as the only valid form here.
  const unitsString = typeof p.units === "string" ? p.units : "";

  // Inventory comes from `inventory` (new field) OR from the legacy `units`
  // array if a record was saved before the rename.
  const inventoryRaw = Array.isArray(p.inventory)
    ? p.inventory
    : Array.isArray(p.units)
    ? p.units
    : [];

  return {
    id: p._id,
    slug: p.slug,
    title: p.name,
    tagline: p.tagline || "",
    location: p.location || "",
    pinShort,

    // Status / type — when admin picked "Other" and filled in the custom
    // text, surface that custom string instead of the literal "Other".
    status: p.status,
    statusLabel: STATUS_LABELS[p.status] || p.status,
    type:
      p.propertyType === "Other" && p.propertyTypeOther
        ? p.propertyTypeOther
        : p.propertyType || "Project",
    tag:
      p.propertyType === "Other" && p.propertyTypeOther
        ? p.propertyTypeOther
        : p.propertyType || "Project",

    // Display strings used by ProjectCard
    units: p.bhk || unitsString || "—",
    sizeRange: p.sqft || "",
    priceFrom: p.priceFrom || "",
    handover: p.handover || "",

    // Detail page hero / gallery
    cover,
    thumb: cover,
    gallery: galleryWithFallback,

    // Body
    description: p.description || "",
    videoUrl: p.videoUrl || "",
    mapEmbed: p.mapEmbed || "",

    // Amenities — keep full {icon, title} objects so the user's custom title
    // (e.g. "Verum Pool") is preserved on the public site.
    amenities: (p.amenities || []).filter((a) => a && (a.icon || a.title)),

    specifications: p.specifications || [],

    // Connectivity / Nearby cards under the map (admin-editable)
    connectivity: p.connectivity || [],

    // Unit availability inventory (admin-editable) — renamed from `units` to
    // avoid colliding with the existing `units` string field on Project
    // (e.g. "184 Apartments") that the Overview row consumes.
    inventory: inventoryRaw,

    // Overview rows (rendered in ProjectDetail)
    overview: [
      p.developmentSize && { label: "Development Size", value: p.developmentSize },
      p.floor && { label: "Floor / Tower", value: p.floor },
      unitsString && { label: "Total Units", value: unitsString },
      p.bhk && { label: "Configuration", value: p.bhk },
      p.handover && { label: "Possession", value: p.handover },
      p.reraNumber && { label: "RERA No.", value: p.reraNumber },
    ].filter(Boolean),

    // Spec strip on detail page (legacy field names kept for compatibility)
    bhk: p.bhk || "—",
    sqft: p.sqft || "—",
    propertyType:
      p.propertyType === "Other" && p.propertyTypeOther
        ? p.propertyTypeOther
        : p.propertyType || "—",

    // SEO
    metaTitle: p.metaTitle || `${p.name} — Nanma Properties`,
    metaDescription:
      p.metaDescription ||
      (p.tagline ? `${p.tagline} — ${p.location}` : p.name),
    keywords: p.keywords || [],
  };
}

export function adaptProjects(items = []) {
  return items.map(adaptProject).filter(Boolean);
}
