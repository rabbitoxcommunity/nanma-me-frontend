/**
 * YouTube helpers — extract the video ID from any common URL form, and
 * derive the auto-generated thumbnail URL.
 *
 *   getYouTubeThumb("https://youtu.be/aqz-KE-bpKQ")
 *     → "https://i.ytimg.com/vi/aqz-KE-bpKQ/hqdefault.jpg"
 *
 *   getYouTubeThumb("aqz-KE-bpKQ")  // bare id also works
 *     → "https://i.ytimg.com/vi/aqz-KE-bpKQ/hqdefault.jpg"
 *
 * `hqdefault.jpg` (480×360) is guaranteed to exist for every YouTube video.
 * For HD videos we could swap to `maxresdefault.jpg`, but that returns 404
 * for older/SD uploads — hqdefault is the safe universal default.
 */

export function extractYouTubeId(input = "") {
  if (!input) return "";
  const url = String(input).trim();

  // youtu.be/ID, youtube.com/watch?v=ID, youtube.com/embed/ID, youtube.com/shorts/ID
  const m = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{6,})/
  );
  if (m) return m[1];

  // Bare ID
  if (/^[\w-]{6,}$/.test(url)) return url;

  return "";
}

export function getYouTubeThumb(input = "") {
  const id = extractYouTubeId(input);
  return id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : "";
}
