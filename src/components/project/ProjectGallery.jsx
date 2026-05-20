import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LazyImage from "../ui/LazyImage";

const AUTO_INTERVAL = 4500; // ms

export default function ProjectGallery({ images = [] }) {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);
  const [paused, setPaused] = useState(false);
  const wrapRef = useRef(null);

  const go = (dir) => {
    setDirection(dir);
    setCurrent((c) => (c + dir + images.length) % images.length);
  };

  // Auto-advance when not hovered and there's more than one image
  useEffect(() => {
    if (images.length <= 1 || paused) return;
    const t = setInterval(() => {
      setDirection(1);
      setCurrent((c) => (c + 1) % images.length);
    }, AUTO_INTERVAL);
    return () => clearInterval(t);
  }, [images.length, paused]);

  if (!images.length) return null;

  return (
    <div
      ref={wrapRef}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Main slider */}
      <div className="relative aspect-[16/10] overflow-hidden rounded-sm bg-cream">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={current}
            custom={direction}
            initial={{ opacity: 0, x: direction * 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -direction * 60 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0"
          >
            <LazyImage src={images[current]} alt={`Slide ${current + 1}`} className="w-full h-full" />
          </motion.div>
        </AnimatePresence>

        {/* Controls */}
        {images.length > 1 && (
          <>
            <button
              onClick={() => go(-1)}
              data-cursor="hover"
              aria-label="Previous"
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-bone/80 backdrop-blur text-graphite flex items-center justify-center hover:bg-terracotta hover:text-bone transition-all duration-300"
            >
              ←
            </button>
            <button
              onClick={() => go(1)}
              data-cursor="hover"
              aria-label="Next"
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-bone/80 backdrop-blur text-graphite flex items-center justify-center hover:bg-terracotta hover:text-bone transition-all duration-300"
            >
              →
            </button>
          </>
        )}

        {/* Counter */}
        <div className="absolute bottom-4 right-4 bg-bone/80 backdrop-blur px-3 py-1.5 rounded-full text-xs text-graphite tracking-widest tabular-nums">
          {String(current + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}
        </div>

        {/* Slim dot indicators */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  setDirection(i > current ? 1 : -1);
                  setCurrent(i);
                }}
                data-cursor="hover"
                aria-label={`Go to slide ${i + 1}`}
                className={`h-1 rounded-full transition-all duration-500 ${
                  i === current ? "w-8 bg-bone" : "w-1.5 bg-bone/50 hover:bg-bone/80"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
