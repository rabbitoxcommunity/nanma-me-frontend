import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import SplitText from "../../animations/SplitText";
import LazyImage from "../ui/LazyImage";

const previewImages = [
  { src: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=900&q=85", h: "h-72 md:h-96", caption: "Azure Skyline" },
  { src: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=900&q=85", h: "h-56 md:h-72", caption: "Living Hall" },
  { src: "https://images.unsplash.com/photo-1600210492493-0946911123ea?w=900&q=85", h: "h-64 md:h-[26rem]", caption: "Pool Deck" },
  { src: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=900&q=85", h: "h-72 md:h-80", caption: "Verdant Villas" },
  { src: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=900&q=85", h: "h-56 md:h-64", caption: "Spa Atrium" },
  { src: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=900&q=85", h: "h-64 md:h-96", caption: "Library" },
];

export default function GalleryPreview() {
  return (
    <section className="py-24 md:py-32">
      <div className="container-x">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div>
            <span className="eyebrow mb-5">
              <span className="number-tag">(07)</span> Gallery
            </span>
            <h2 className="display-2 mt-6">
              <SplitText text="A glimpse, " splitBy="word" stagger={0.06} />
              <span className="editorial text-terracotta">
                <SplitText text="from inside." splitBy="word" stagger={0.06} delay={0.3} />
              </span>
            </h2>
          </div>
          <Link to="/gallery" data-cursor="hover" className="btn-link">
            See full gallery <span aria-hidden>→</span>
          </Link>
        </div>

        {/* Masonry-style preview using CSS columns */}
        <div className="columns-2 md:columns-3 gap-4 md:gap-6 [column-fill:_balance]">
          {previewImages.map((img, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-5% 0px" }}
              transition={{ duration: 0.7, delay: (i % 3) * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className={`mb-4 md:mb-6 break-inside-avoid group relative overflow-hidden rounded-sm cursor-pointer`}
              data-cursor="text"
            >
              <LazyImage
                src={img.src}
                alt={img.caption}
                className={img.h}
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
