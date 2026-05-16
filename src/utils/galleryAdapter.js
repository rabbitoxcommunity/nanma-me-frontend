/**
 * Maps a backend Gallery document into the shape the public Gallery page
 * and lightbox already expect.
 *
 * Backend shape: { _id, title, type: 'image'|'video'|'youtube', category,
 *                  url, publicId, thumbnail, youtubeUrl, aspect, sortOrder }
 *
 * Frontend shape: { id, type, category, src, thumb, caption, aspect }
 */

import { getYouTubeThumb } from "./youtube";

// Must mirror the CMS categories in GalleryAdmin.jsx so every uploaded item
// is reachable from a public tab.
export const GALLERY_CATEGORIES = [
  { key: "all", label: "All" },
  { key: "exterior", label: "Exteriors" },
  { key: "interior", label: "Interiors" },
  { key: "amenities", label: "Amenities" },
  { key: "video", label: "Films" },
  { key: "other", label: "Other" },
];

const PLACEHOLDER_THUMB =
  "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&q=80";

export function adaptGalleryItem(g) {
  if (!g) return null;
  const isYouTube = g.type === "youtube";

  // For YouTube: custom thumbnail wins → otherwise auto-derive from the URL
  // (YouTube always serves a default thumb at /vi/<id>/hqdefault.jpg)
  // For images/videos: any custom thumbnail wins → otherwise the URL itself.
  let thumb;
  if (isYouTube) {
    thumb = g.thumbnail || getYouTubeThumb(g.youtubeUrl) || PLACEHOLDER_THUMB;
  } else {
    thumb = g.thumbnail || g.url;
  }

  return {
    id: g._id,
    type: g.type,
    category: g.category,
    src: isYouTube ? g.youtubeUrl : g.url,
    thumb,
    caption: g.title,
    aspect: g.aspect || "wide",
    showOnHome: !!g.showOnHome,
  };
}

export function adaptGalleryItems(items = []) {
  return items
    .filter((g) => g && (g.url || g.youtubeUrl))
    .map(adaptGalleryItem);
}
