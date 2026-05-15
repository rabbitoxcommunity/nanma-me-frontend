import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LazyImage from "../ui/LazyImage";

export default function ProjectGallery({ images = [] }) {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);

  const go = (dir) => {
    setDirection(dir);
    setCurrent((c) => (c + dir + images.length) % images.length);
  };

  return (
    <div>
      {/* Main */}
      <div className="relative aspect-[16/10] overflow-hidden rounded-sm bg-cream mb-4">
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

        {/* Counter */}
        <div className="absolute bottom-4 right-4 bg-bone/80 backdrop-blur px-3 py-1.5 rounded-full text-xs text-graphite tracking-widest">
          {String(current + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}
        </div>
      </div>

      {/* Thumbs */}
      <div className="grid grid-cols-4 md:grid-cols-6 gap-2 md:gap-3">
        {images.map((src, i) => (
          <button
            key={i}
            data-cursor="hover"
            onClick={() => {
              setDirection(i > current ? 1 : -1);
              setCurrent(i);
            }}
            className={`relative aspect-square overflow-hidden rounded-sm transition-opacity duration-300 ${
              i === current ? "opacity-100 ring-2 ring-terracotta" : "opacity-60 hover:opacity-100"
            }`}
          >
            <img src={src} alt="" loading="lazy" className="w-full h-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}
