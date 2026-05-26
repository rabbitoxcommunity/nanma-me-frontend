import { motion } from "framer-motion";
import SplitText from "../../animations/SplitText";
import { amenityCatalog } from "../../data/amenities";

const featured = ["pool", "gym", "yoga", "garden", "concierge", "security", "lounge", "parking"];

export default function AmenitiesSection() {
  return (
    <section className="py-24 md:py-36 bg-cream">
      <div className="container-x">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-16">
          <div className="md:col-span-7">
            {/* <span className="eyebrow mb-5">
              <span className="number-tag">(05)</span> Signature Amenities
            </span> */}
            <h2 className="display-2 mt-6">
              <SplitText text="Every thoughtful detail, " splitBy="word" stagger={0.05} />
              <br />
              <span className="editorial text-terracotta">
                <SplitText text="standard." splitBy="char" stagger={0.05} delay={0.4} />
              </span>
            </h2>
          </div>
          {/* <div className="md:col-span-4 md:col-start-9 self-end">
            <p className="body">
              From private spas to concierge services — every Nanma residence is served by amenities that feel less like inclusions, more like quiet luxuries.
            </p>
          </div> */}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-line">
          {featured.map((key, i) => {
            const a = amenityCatalog[key];
            const Icon = a.icon;
            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-5% 0px" }}
                transition={{ duration: 0.6, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }}
                className="bg-cream p-8 md:p-10 hover:bg-pearl transition-colors duration-500 group"
              >
                <Icon className="w-8 h-8 md:w-10 md:h-10 text-terracotta mb-6 group-hover:scale-110 transition-transform duration-500" />
                <div className="font-display text-lg md:text-xl text-graphite font-light leading-snug">
                  {a.label}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
