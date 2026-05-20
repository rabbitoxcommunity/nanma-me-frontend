import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import SplitText from "../../animations/SplitText";
import BlurText from "../../animations/BlurText";
import LazyImage from "../ui/LazyImage";

export default function CompanyOverview() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const imgY = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  return (
    <section ref={ref} className="py-14 md:py-20">
      <div className="container-x">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          {/* Left image */}
          <div className="lg:col-span-6 order-2 lg:order-1">
            <div className="relative aspect-[4/5] overflow-hidden rounded-sm grain">
              <motion.div style={{ y: imgY }} className="absolute inset-0 w-full h-[115%] -top-[8%]">
                <LazyImage
                  src="https://images.unsplash.com/photo-1600210492493-0946911123ea?w=1400&q=85"
                  alt="Architectural detail"
                  className="w-full h-full"
                  imgClassName="w-full h-full object-cover"
                />
              </motion.div>
            </div>
            {/* Floating signature */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="bg-cream rounded-sm p-6 -mt-16 ml-auto mr-6 md:mr-12 max-w-xs relative z-10 shadow-sm"
            >
              <div className="font-display text-3xl text-graphite font-light tracking-tighter2">2006</div>
              <div className="text-xs uppercase tracking-ultrawide text-smoke mt-1">
                Year of Inception
              </div>
            </motion.div>
          </div>

          {/* Right text */}
          <div className="lg:col-span-6 order-1 lg:order-2">
            <span className="eyebrow mb-5">
              <span className="number-tag">(03)</span> Our Practice
            </span>
            <h2 className="display-2 mt-6">
              <SplitText text="A small studio. " splitBy="word" stagger={0.06} />
              <br />
              <span className="editorial text-terracotta">
                <SplitText text="An uncommon" splitBy="word" stagger={0.06} delay={0.4} />
              </span>{" "}
              <SplitText text="conviction." splitBy="char" stagger={0.05} delay={0.7} />
            </h2>

            <div className="space-y-5 mt-10 max-w-lg">
              <BlurText
                text="Founded in 2006, Nanma is a small Mumbai-based real estate atelier — designing, building, and delivering a tightly held portfolio of luxury residences."
                className="body-lg block"
                delay={0.5}
              />
              <BlurText
                text="We never break ground on more than three projects at a time. Each one is treated as a singular act of architecture — not a unit of inventory."
                className="body block"
                delay={0.7}
              />
            </div>

            <div className="flex flex-wrap gap-4 mt-10">
              <Link to="/about" data-cursor="hover" className="btn-primary">
                Read Our Story <span aria-hidden>→</span>
              </Link>
              <Link to="/projects" data-cursor="hover" className="btn-ghost">
                Explore Projects
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
