import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import SplitText from "../../animations/SplitText";
import LazyImage from "../ui/LazyImage";
import SectionCTA from "../ui/SectionCTA";
import { galleryService } from "../../services/galleryService";

export default function GalleryPreview() {
  // null = not loaded yet, [] = loaded with zero items, [...] = loaded with items
  const [tiles, setTiles] = useState(null);

  useEffect(() => {
    let alive = true;
    galleryService
      .list({ onHome: true, limit: 6 })
      .then(({ items }) => {
        if (!alive) return;
        setTiles(
          items.map((it) => ({
            src: it.type === "youtube" ? it.thumb : it.src,
            caption: it.caption,
          }))
        );
      })
      .catch(() => {
        if (alive) setTiles([]);
      });
    return () => {
      alive = false;
    };
  }, []);

  // Hide the entire section until we know we have items to show.
  // If admin hasn't flagged any gallery item with "Show on Home", render nothing.
  if (!tiles || tiles.length === 0) return null;

  return (
    <section className="py-24 md:py-32">
      <div className="container-x">
        <div className="mb-14">
          {/* <span className="eyebrow mb-5">
            <span className="number-tag">(08)</span> Gallery
          </span> */}
          <div className="flex flex-col items-start md:flex-row md:items-center justify-between gap-6 md:gap-10 mt-6">
            <h2 className="display-2">
              <SplitText text="A glimpse, " splitBy="word" stagger={0.06} />
              <span className="editorial text-terracotta">
                <SplitText text="from inside." splitBy="word" stagger={0.06} delay={0.3} />
              </span>
            </h2>
            <SectionCTA to="/gallery">See full gallery</SectionCTA>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {tiles.slice(0, 6).map((img, i) => (
            <motion.div
              key={img.src + i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-5% 0px" }}
              transition={{ duration: 0.7, delay: (i % 3) * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="group relative overflow-hidden rounded-sm cursor-pointer"
              data-cursor="text"
            >
              <LazyImage
                src={img.src}
                alt={img.caption}
                aspect="aspect-[4/3]"
                imgClassName="transition-transform duration-700 ease-out-expo group-hover:scale-105"
              >
                <div className="absolute inset-0 bg-graphite/0 group-hover:bg-graphite/30 transition-colors duration-500" />
                <div className="absolute bottom-3 left-4 text-bone text-xs uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  {img.caption}
                </div>
              </LazyImage>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
