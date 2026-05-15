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
  textClass = "",
  taglineClass = "",
}) {
  if (variant === "stacked") {
    return (
      <div className={`inline-flex flex-col items-center ${className}`}>
        <LogoMark className={`w-14 h-14 ${markClass}`} />
        <div className={`font-display tracking-[0.35em] text-2xl mt-3 ${textClass}`}>
          NANMA
        </div>
        {showTagline && (
          <div className={`text-[11px] tracking-[0.2em] mt-1 opacity-70 ${taglineClass}`}>
            By Meeran
          </div>
        )}
      </div>
    );
  }

  // Horizontal (used in navbar/footer header)
  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      <LogoMark className={`w-7 h-7 ${markClass}`} />
      <div className="flex flex-col leading-none">
        <span className={`font-display tracking-[0.32em] text-[15px] ${textClass}`}>
          NANMA
        </span>
        {showTagline && (
          <span className={`text-[8.5px] tracking-[0.22em] mt-1 opacity-70 ${taglineClass}`}>
            By Meeran
          </span>
        )}
      </div>
    </div>
  );
}
