import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import SplitText from "../../animations/SplitText";
import BlurText from "../../animations/BlurText";
import TextReveal from "../../animations/TextReveal";
import { projectsApi } from "../../admin/api/endpoints";


const STATUS_LABELS = {
  ongoing: "Ongoing",
  ready: "Ready to Move In",
  completed: "Completed",
  upcoming: "New Launch",
};

const PLACEHOLDER_IMG =
  "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=2200&q=85";

// Convert a backend Project doc into the shape this slider renders
function adaptToSlide(p) {
  const img =
    p.featuredImage?.url || p.galleryImages?.[0]?.url || PLACEHOLDER_IMG;
  // Smart split: use full name as title; place property type / a single
  // descriptor on the italic terracotta sub-line for editorial feel.
  // When admin picked "Other", prefer the custom propertyTypeOther string.
  const resolvedType =
    p.propertyType === "Other" && p.propertyTypeOther
      ? p.propertyTypeOther
      : p.propertyType;
  const sub = resolvedType || STATUS_LABELS[p.status] || "";
  return {
    img,
    label: STATUS_LABELS[p.status] || "Featured",
    location: p.location || "",
    title: p.name,
    sub,
    // Subtitle paragraph — pulled from project's tagline (admin-edited)
    tagline: p.tagline || "",
    slug: p.slug,
  };
}

export default function HeroSlider() {
  const [slides, setSlides] = useState([]);
  const [current, setCurrent] = useState(0);
  const ref = useRef(null);

  // Pull banner-flagged projects from API; gracefully fall back to defaults.
  useEffect(() => {
    let alive = true;
    projectsApi
      .publicList({ banner: true, limit: 5 })
      .then(({ items = [] }) => {
        if (!alive) return;
        if (items.length) {
          setSlides(items.map(adaptToSlide));
          setCurrent(0);
        }
      })
      .catch(() => {
        // network error → keep fallback
      });
    return () => {
      alive = false;
    };
  }, []);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "10%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  useEffect(() => {
    if (slides.length <= 1) return;
    const t = setInterval(() => setCurrent((c) => (c + 1) % slides.length), 7000);
    return () => clearInterval(t);
  }, [slides.length]);

  if (!slides.length) {
    return (
      <section className="relative h-screen min-h-[680px] w-full bg-neutral-400" />
    );
  }

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
            {/* Dark overlays — gradient runs bottom → top so text at bottom
                is most readable, image stays visible at the top of the frame. */}
            <div className="absolute inset-0 bg-gradient-to-t from-graphite/95 via-graphite/55 to-graphite/20" />
            <div className="absolute inset-0 bg-graphite/20" />
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
                <div className="inline-flex items-center gap-4">
                  <span className="px-3 py-1 text-[10px] uppercase tracking-ultrawide bg-terracotta text-bone rounded-full">
                    {slides[current].label}
                  </span>
                  <span className="flex items-center gap-2 text-[11px] uppercase tracking-ultrawide text-bone/60">
                    <span className="w-5 h-px bg-bone/30" />
                    {slides[current].location}
                  </span>
                </div>
              </TextReveal>

              <h1 className="font-display font-light leading-[0.92] tracking-tightest">
                <div className="overflow-hidden">
                  <SplitText
                    text={slides[current].title}
                    splitBy="word"
                    delay={0.1}
                    stagger={0.1}
                    duration={1}
                    className="text-4xl xs:text-7xl md:text-8xl lg:text-[7rem] block"
                  />
                </div>
                <div className="overflow-hidden">
                  <SplitText
                    text={slides[current].sub}
                    splitBy="word"
                    delay={0.3}
                    stagger={0.1}
                    duration={1}
                    className="text-4xl xs:text-7xl md:text-8xl lg:text-[7rem] block editorial italic text-terracotta"
                  />
                </div>
              </h1>

              {slides[current].tagline && (
                <div className="max-w-xl">
                  <BlurText
                    text={slides[current].tagline}
                    delay={0.6}
                    duration={1.2}
                    className="text-base md:text-lg text-bone/80"
                  />
                </div>
              )}

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

    </section>
  );
}
