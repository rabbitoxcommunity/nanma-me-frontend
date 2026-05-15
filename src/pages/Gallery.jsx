import { useState, useMemo } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { FiPlay } from "react-icons/fi";
import SplitText from "../animations/SplitText";
import BlurText from "../animations/BlurText";
import PageTransition from "../components/layout/PageTransition";
import SEO from "../components/ui/SEO";
import LazyImage from "../components/ui/LazyImage";
import Lightbox from "../components/gallery/Lightbox";
import { galleryCategories, galleryItems } from "../data/gallery";

const aspectMap = {
  tall: "row-span-2",
  wide: "col-span-1",
  square: "",
};

export default function Gallery() {
  const [active, setActive] = useState("all");
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const filtered = useMemo(
    () => (active === "all" ? galleryItems : galleryItems.filter((g) => g.category === active)),
    [active]
  );

  return (
    <PageTransition>
      <SEO
        title="Gallery — Nanma Estates"
        description="Explore the Nanma Estates gallery of architectural exteriors, interiors, amenities, and films from our completed and ongoing projects."
        url="https://nanmaestates.com/gallery"
      />

      <section className="pt-32 md:pt-44 pb-12">
        <div className="container-x">
          <span className="eyebrow mb-6">
            <span className="number-tag">(Gallery)</span> A visual journal
          </span>
          <h1 className="display-1 mt-6 max-w-[14ch] text-balance">
            <SplitText text="A glimpse, " splitBy="word" stagger={0.06} />
            <br />
            <span className="editorial text-terracotta">
              <SplitText text="from inside." splitBy="word" stagger={0.06} delay={0.4} />
            </span>
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mt-10">
            <div className="md:col-span-6 md:col-start-7">
              <BlurText
                text="Architectural exteriors, intimate interiors, signature amenities, and short films — a curated visual record of our work."
                className="body-lg"
                delay={0.5}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="sticky top-20 z-20 bg-bone/85 backdrop-blur-xl border-y border-line">
        <div className="container-x">
          <LayoutGroup>
            <div className="flex flex-wrap items-center gap-2 py-4">
              {galleryCategories.map((c) => {
                const isActive = active === c.key;
                return (
                  <button
                    key={c.key}
                    onClick={() => setActive(c.key)}
                    data-cursor="hover"
                    className="relative px-5 py-2.5 text-sm rounded-full transition-colors duration-300 whitespace-nowrap"
                  >
                    {isActive && (
                      <motion.span
                        layoutId="gallery-tab-bg"
                        className="absolute inset-0 bg-graphite rounded-full"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                    <span className={`relative z-10 ${isActive ? "text-bone" : "text-smoke hover:text-graphite"}`}>
                      {c.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </LayoutGroup>
        </div>
      </section>

      {/* Masonry grid (CSS columns for true masonry behaviour) */}
      <section className="py-16 md:py-24">
        <div className="container-x">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="columns-1 sm:columns-2 lg:columns-3 gap-4 md:gap-6"
            >
              {filtered.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: (i % 6) * 0.06, ease: [0.16, 1, 0.3, 1] }}
                  onClick={() => setLightboxIndex(i)}
                  data-cursor="text"
                  className={`mb-4 md:mb-6 break-inside-avoid relative group cursor-pointer overflow-hidden rounded-sm ${aspectMap[item.aspect] || ""}`}
                >
                  <LazyImage
                    src={item.type === "youtube" ? item.thumb : item.src}
                    alt={item.caption}
                    aspect={
                      item.aspect === "tall"
                        ? "aspect-[3/4]"
                        : item.aspect === "wide"
                        ? "aspect-[4/3]"
                        : "aspect-square"
                    }
                    imgClassName="transition-transform duration-700 ease-out-expo group-hover:scale-105"
                  >
                    <div className="absolute inset-0 bg-graphite/0 group-hover:bg-graphite/40 transition-colors duration-500" />

                    {item.type === "youtube" && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 rounded-full bg-bone/95 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                          <FiPlay className="w-6 h-6 text-graphite ml-1" />
                        </div>
                      </div>
                    )}

                    <div className="absolute bottom-3 left-4 right-4 flex justify-between items-end opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <span className="text-bone text-xs uppercase tracking-widest">
                        {item.caption}
                      </span>
                      <span className="text-bone/60 text-[10px] uppercase tracking-widest">
                        {item.type === "youtube" ? "Film" : "Image"}
                      </span>
                    </div>
                  </LazyImage>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <Lightbox
          items={filtered}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onPrev={() =>
            setLightboxIndex((i) => (i - 1 + filtered.length) % filtered.length)
          }
          onNext={() => setLightboxIndex((i) => (i + 1) % filtered.length)}
        />
      )}
    </PageTransition>
  );
}
