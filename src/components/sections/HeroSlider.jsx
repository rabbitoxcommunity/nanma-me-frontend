import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import SplitText from "../../animations/SplitText";
import BlurText from "../../animations/BlurText";
import TextReveal from "../../animations/TextReveal";

const slides = [
  {
    img: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=2200&q=85",
    label: "Now Selling",
    location: "Marine Drive, Mumbai",
    title: "Azure Skyline",
    sub: "Residences",
    slug: "azure-skyline-residences",
  },
  {
    img: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=2200&q=85",
    label: "Ready to Move In",
    location: "Lonavala, Maharashtra",
    title: "Verdant Villas",
    sub: "by the Lake",
    slug: "verdant-villas-by-the-lake",
  },
  {
    img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=2200&q=85",
    label: "Pre-Launch",
    location: "Whitefield, Bangalore",
    title: "The Grove",
    sub: "Residences",
    slug: "the-grove-residences",
  },
];

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const ref = useRef(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "10%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  useEffect(() => {
    const t = setInterval(() => setCurrent((c) => (c + 1) % slides.length), 7000);
    return () => clearInterval(t);
  }, []);

  return (
    <section ref={ref} className="relative h-screen min-h-[680px] w-full overflow-hidden">
      {/* Slides */}
      {slides.map((slide, i) => (
        <motion.div
          key={i}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: i === current ? 1 : 0 }}
          transition={{ duration: 1.4, ease: [0.65, 0, 0.35, 1] }}
        >
          <motion.div style={{ y: imgY }} className="absolute inset-0 w-full h-[120%] -top-[10%]">
            <img
              src={slide.img}
              alt={slide.title}
              className={`w-full h-full object-cover ${i === current ? "animate-slow-zoom" : ""}`}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-graphite/40 via-graphite/10 to-graphite/80" />
            <div className="absolute inset-0 bg-graphite/15" />
          </motion.div>
        </motion.div>
      ))}

      {/* Content — pinned to bottom, aligned via container-x like every other page */}
      <motion.div
        style={{ y: contentY, opacity }}
        className="absolute inset-x-0 bottom-0 z-10 pb-16 md:pb-24 text-bone"
      >
        <div className="container-x">
          <AnimatePresence mode="wait">
            <motion.div key={current} className="space-y-6 md:space-y-8 text-left">
              <TextReveal>
                <span className="inline-flex items-center gap-3 text-xs uppercase tracking-ultrawide text-bone/80">
                  <span className="w-8 h-px bg-terracotta" />
                  {slides[current].label} · {slides[current].location}
                </span>
              </TextReveal>

              <h1 className="font-display font-light leading-[0.92] tracking-tightest">
                <div className="overflow-hidden">
                  <SplitText
                    text={slides[current].title}
                    splitBy="word"
                    delay={0.1}
                    stagger={0.1}
                    duration={1}
                    className="text-6xl xs:text-7xl md:text-8xl lg:text-[9rem] block"
                  />
                </div>
                <div className="overflow-hidden">
                  <SplitText
                    text={slides[current].sub}
                    splitBy="word"
                    delay={0.3}
                    stagger={0.1}
                    duration={1}
                    className="text-6xl xs:text-7xl md:text-8xl lg:text-[9rem] block editorial italic text-terracotta"
                  />
                </div>
              </h1>

              <div className="pt-4 max-w-xl">
                <BlurText
                  text="A small portfolio of architecturally significant homes — designed, built, and delivered by us alone."
                  delay={0.6}
                  duration={1.2}
                  className="text-base md:text-lg text-bone/80"
                />
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                <Link
                  to={`/projects/${slides[current].slug}`}
                  data-cursor="hover"
                  className="inline-flex items-center gap-3 px-7 py-4 bg-bone text-graphite text-sm rounded-full hover:bg-terracotta hover:text-bone transition-all duration-500 ease-out-expo hover:gap-4"
                >
                  Explore Project <span aria-hidden>→</span>
                </Link>
                <Link
                  to="/projects"
                  data-cursor="hover"
                  className="inline-flex items-center gap-3 px-7 py-4 border border-bone/30 text-bone text-sm rounded-full hover:bg-bone hover:text-graphite transition-all duration-500"
                >
                  All Projects
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Slide indicators */}
      <div className="absolute right-6 md:right-10 bottom-1/2 translate-y-1/2 hidden md:flex flex-col gap-3 z-10">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            data-cursor="hover"
            aria-label={`Slide ${i + 1}`}
            className={`w-px transition-all duration-700 ${
              i === current ? "h-12 bg-terracotta" : "h-4 bg-bone/40 hover:bg-bone"
            }`}
          />
        ))}
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-6 left-5 sm:left-8 md:left-12 lg:left-16 z-10 flex flex-col items-start gap-2 text-bone/60"
      >
        <span className="text-[10px] uppercase tracking-ultrawide">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="w-px h-8 bg-gradient-to-b from-bone/60 to-transparent"
        />
      </motion.div>
    </section>
  );
}
