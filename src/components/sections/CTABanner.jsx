import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import SplitText from "../../animations/SplitText";

export default function CTABanner() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"]);

  return (
    <section ref={ref} className="relative h-[80vh] min-h-[520px] overflow-hidden flex items-center justify-center">
      <motion.div style={{ y: imgY }} className="absolute inset-0 w-full h-[125%] -top-[12%]">
        <img
          src="/image3.webp"
          alt=""
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-graphite/65" />
      </motion.div>

      <div className="container-x relative z-10 text-center text-bone">
        <span className="eyebrow text-bone/60 mb-6 inline-flex">
          <span className="w-8 h-px bg-terracotta" />
          <span className="ml-2">A new standard</span>
        </span>
        <h2 className="font-display font-light leading-[0.95] tracking-tightest text-balance">
          <SplitText
            text="Every home has a story."
            splitBy="word"
            stagger={0.08}
            duration={1}
            className="text-4xl md:text-6xl lg:text-7xl block"
          />
          <span className="editorial italic text-terracotta">
            <SplitText
              text="Let yours begin with us."
              splitBy="word"
              stagger={0.08}
              duration={1}
              delay={0.4}
              className="text-4xl md:text-6xl lg:text-7xl block mt-2"
            />
          </span>
        </h2>
        <div className="mt-12 flex flex-wrap justify-center gap-4">
          <Link
            to="/contact"
            data-cursor="hover"
            className="inline-flex items-center gap-3 px-8 py-4 bg-bone text-graphite text-sm rounded-full hover:bg-terracotta hover:text-bone transition-all duration-500 ease-out-expo hover:gap-4"
          >
            Schedule a Site Visit <span aria-hidden>→</span>
          </Link>
          <Link
            to="/projects"
            data-cursor="hover"
            className="inline-flex items-center gap-3 px-8 py-4 border border-bone/30 text-bone text-sm rounded-full hover:bg-bone hover:text-graphite transition-all duration-500"
          >
            Browse Projects
          </Link>
        </div>
      </div>
    </section>
  );
}
