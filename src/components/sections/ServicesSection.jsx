import { motion } from "framer-motion";
import { FiArrowUpRight } from "react-icons/fi";
import SplitText from "../../animations/SplitText";

const SERVICES = [
  {
    n: "01",
    title: "Turnkey",
    description:
      "From land selection through to keys-in-hand. We design, develop, and deliver — owning every detail of a project's lifecycle.",
  },
  {
    n: "02",
    title: "Housing",
    description:
      "Apartments, villas, and bespoke residences across India's most coveted addresses — every home crafted to endure.",
  },
  {
    n: "03",
    title: "Infrastructure",
    description:
      "Roads, civil works, and large-scale infrastructure — engineered with the same quiet conviction we bring to private homes.",
  },
];

export default function ServicesSection() {
  return (
    <section className="py-24 md:py-36">
      <div className="container-x">
        {/* ── Header ───────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-14 md:mb-20">
          <div className="md:col-span-7">
            {/* <span className="eyebrow mb-5">
              <span className="number-tag">(04)</span> Services
            </span> */}
            <h2 className="display-2 mt-6">
              <SplitText text="What we do, " splitBy="word" stagger={0.06} />
              <br />
              <span className="editorial text-terracotta">
                <SplitText text="end to end." splitBy="word" stagger={0.06} delay={0.3} />
              </span>
            </h2>
          </div>
          {/* <div className="md:col-span-4 md:col-start-9 self-end">
            <p className="body">
              Three practices, one philosophy. We bring the same patience and
              craft to a 200-unit tower as we do to a single villa or a stretch
              of road.
            </p>
          </div> */}
        </div>

        {/* ── Rows ─────────────────────────────── */}
        <div className="border-t border-line">
          {SERVICES.map(({ n, title, description }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-5% 0px" }}
              transition={{ duration: 0.8, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="group relative border-b border-line cursor-pointer overflow-hidden"
              data-cursor="hover"
            >
              {/* Sliding terracotta background on hover */}
              <div className="absolute inset-y-0 left-0 w-0 group-hover:w-full bg-graphite transition-[width] duration-700 ease-out-expo pointer-events-none" />

              {/* Row content */}
              <div className="relative grid grid-cols-12 gap-4 md:gap-8 items-baseline py-8 md:py-12 px-1">
              

                {/* Title — sized down so "Infrastructure" fits its column */}
                <h3 className="col-span-12 md:col-span-6 font-display text-4xl md:text-5xl lg:text-6xl font-light tracking-tightest leading-[0.95] uppercase text-graphite group-hover:text-bone transition-colors duration-700 -mt-2 md:mt-0">
                  {title}
                </h3>

                {/* Description */}
                <p className="col-span-12 md:col-span-4 text-sm md:text-[15px] text-smoke group-hover:text-bone/70 leading-relaxed transition-colors duration-700 md:pt-1.5">
                  {description}
                </p>

                {/* Arrow */}
                <span className="hidden md:flex col-span-1 justify-end items-center">
                  <span className="w-11 h-11 rounded-full border border-line group-hover:border-terracotta bg-transparent group-hover:bg-terracotta text-graphite group-hover:text-bone flex items-center justify-center transition-all duration-500 group-hover:rotate-45">
                    <FiArrowUpRight className="w-4 h-4" />
                  </span>
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
