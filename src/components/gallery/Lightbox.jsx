import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiChevronLeft, FiChevronRight } from "react-icons/fi";

export default function Lightbox({ items, index, onClose, onPrev, onNext }) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose, onPrev, onNext]);

  const item = items[index];
  if (!item) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
        className="fixed inset-0 z-[80] bg-graphite/95 backdrop-blur-sm flex items-center justify-center p-4 md:p-12"
        onClick={onClose}
      >
        {/* Close */}
        <button
          onClick={onClose}
          data-cursor="hover"
          aria-label="Close"
          className="absolute top-5 right-5 md:top-8 md:right-8 w-12 h-12 rounded-full bg-bone/10 hover:bg-bone/20 backdrop-blur text-bone flex items-center justify-center transition-colors z-10"
        >
          <FiX className="w-5 h-5" />
        </button>

        {/* Counter */}
        <div className="absolute top-5 left-5 md:top-8 md:left-8 text-bone/70 text-xs uppercase tracking-ultrawide">
          {String(index + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
        </div>

        {/* Prev */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onPrev();
          }}
          data-cursor="hover"
          aria-label="Previous"
          className="absolute left-3 md:left-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-bone/10 hover:bg-bone/20 backdrop-blur text-bone flex items-center justify-center transition-colors z-10"
        >
          <FiChevronLeft className="w-5 h-5" />
        </button>

        {/* Next */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onNext();
          }}
          data-cursor="hover"
          aria-label="Next"
          className="absolute right-3 md:right-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-bone/10 hover:bg-bone/20 backdrop-blur text-bone flex items-center justify-center transition-colors z-10"
        >
          <FiChevronRight className="w-5 h-5" />
        </button>

        {/* Content */}
        <motion.div
          key={item.id}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          onClick={(e) => e.stopPropagation()}
          className="relative max-w-6xl max-h-[85vh] w-full"
        >
          {item.type === "youtube" ? (
            <div className="aspect-video w-full">
              <iframe
                src={`${item.src}?autoplay=1&rel=0`}
                title={item.caption}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full rounded-sm"
              />
            </div>
          ) : (
            <img
              src={item.src}
              alt={item.caption}
              className="w-full h-full object-contain max-h-[80vh] rounded-sm"
            />
          )}
          <div className="text-center mt-5 text-bone/80 text-sm tracking-widest uppercase">
            {item.caption}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
