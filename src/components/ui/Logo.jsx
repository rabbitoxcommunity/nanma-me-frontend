/**
 * Nanma logo (SVG recreation of the "NANMA By Meeran" mark).
 *
 * To swap with your raster logo file later: drop your image at
 *   public/logo.png
 * and replace the <svg>…</svg> below with:
 *   <img src="/logo.png" alt="Nanma" className="h-full w-auto" />
 */

const slats = (count, x, width, startY, gap = 4, slatHeight = 2) =>
  Array.from({ length: count }, (_, i) => (
    <rect
      key={i}
      x={x}
      y={startY + i * gap}
      width={width}
      height={slatHeight}
      rx="0.4"
    />
  ));

export function LogoMark({ className = "" }) {
  return (
    <svg
      viewBox="0 0 110 100"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <g fill="currentColor">
        {/* Building 1 — taller, left */}
        {slats(18, 8, 44, 4)}
        {/* Building 2 — shorter, right (slightly overlapping) */}
        {slats(13, 56, 38, 28)}
      </g>
    </svg>
  );
}

export default function Logo({
  variant = "horizontal", // "horizontal" | "stacked"
  showTagline = false,
  className = "",
  markClass = "",
  markStyle = {},
  textClass = "",
  taglineClass = "",
}) {
  if (variant === "stacked") {
    return (
      <div className={`inline-flex flex-col items-center ${className}`}>
        <img src="/logo.png" alt="Nanma" className={markClass} style={markStyle} />
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      <img src="/logo.png" alt="Nanma" className={markClass} style={markStyle} />
    </div>
  );
}
