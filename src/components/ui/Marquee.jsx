export default function Marquee({ items = [], speed = 40, className = "" }) {
  const repeated = [...items, ...items];
  return (
    <div className={`overflow-hidden border-y border-line py-6 ${className}`}>
      <div
        className="flex gap-12 whitespace-nowrap animate-marquee"
        style={{ animationDuration: `${speed}s` }}
      >
        {repeated.map((it, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-12 font-display text-3xl md:text-5xl text-graphite font-light tracking-tighter2"
          >
            {it}
            <span className="text-terracotta editorial italic text-2xl md:text-4xl">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
