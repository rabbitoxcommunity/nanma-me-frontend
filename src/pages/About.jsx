import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { PiCompass, PiTarget, PiTrophy, PiHandshake } from "react-icons/pi";
import SplitText from "../animations/SplitText";
import BlurText from "../animations/BlurText";
import Counter from "../animations/Counter";
import PageTransition from "../components/layout/PageTransition";
import SEO from "../components/ui/SEO";
import LazyImage from "../components/ui/LazyImage";

const timeline = [
  { year: "2006", title: "Founded in Mumbai", desc: "Nanma is established by Aruna Vance with a single bungalow restoration in Bandra." },
  { year: "2010", title: "First high-rise", desc: "The 22-storey Aria Tower delivered to acclaim, setting a new standard in Worli." },
  { year: "2014", title: "Expansion to Bangalore", desc: "Opening of the Indiranagar atelier and the launch of Altura Skyline." },
  { year: "2018", title: "International recognition", desc: "Awarded 'Best Boutique Developer in South Asia' by World Architecture Forum." },
  { year: "2021", title: "Verdant Villas debut", desc: "Our first villa community on a private lake in Lonavala — sold out in eleven weeks." },
  { year: "2026", title: "Three concurrent flagships", desc: "Azure Skyline, The Cloister, and The Grove — our most ambitious year on record." },
];

const team = [
  { name: "Aruna Vance", role: "Founder & Managing Director", img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&q=80" },
  { name: "Vikram Reddy", role: "Head of Design", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&q=80" },
  { name: "Priya Krishnan", role: "Director, Sales & Experience", img: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=600&q=80" },
  { name: "Ravi Menon", role: "Head of Construction", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80" },
];

const achievements = [
  { Icon: PiTrophy, label: "World Architecture Forum 2024" },
  { Icon: PiTrophy, label: "Architectural Digest 50, 2025" },
  { Icon: PiTrophy, label: "Indian Realty Awards — Boutique Developer 2023" },
  { Icon: PiTrophy, label: "BCI Asia Top Developers 2022, 2024" },
];

const stats = [
  { value: 18, suffix: "+", label: "Years in Practice" },
  { value: 42, suffix: "", label: "Projects Delivered" },
  { value: 4200, prefix: "₹", suffix: " Cr", label: "Transacted Value" },
  { value: 98, suffix: "%", label: "Client Retention" },
];

export default function About() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start end", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  return (
    <PageTransition>
      <SEO
        title="About Nanma Estates — Our Story & Practice"
        description="Founded in 2006, Nanma Estates is a boutique luxury developer building a small portfolio of architecturally significant residences across India."
        url="https://nanmaconstruct.com/about"
      />

      {/* HERO */}
      <section className="pt-32 md:pt-44 pb-12">
        <div className="container-x">
          <span className="eyebrow mt-12">
            <span className="number-tag">(About)</span> Our practice
          </span>
          <h1 className="display-1 mt-6 max-w-[16ch] text-balance">
            <SplitText text="A small studio, " splitBy="word" stagger={0.06} />
            <br />
            <span className="editorial text-terracotta">
              <SplitText text="building " splitBy="word" stagger={0.06} delay={0.4} />
            </span>
            <SplitText text="quietly remarkable homes." splitBy="word" stagger={0.06} delay={0.7} />
          </h1>
        </div>
      </section>

      {/* INTRO IMAGE + COPY */}
      <section ref={heroRef} className="pb-24 md:pb-32">
        <div className="container-x grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          <div className="lg:col-span-7 relative aspect-[16/10] overflow-hidden rounded-sm grain">
            <motion.div style={{ y: heroY }} className="absolute inset-0 w-full h-[115%] -top-[8%]">
              <LazyImage
                src="https://images.unsplash.com/photo-1600210492493-0946911123ea?w=1800&q=85"
                alt="Atelier"
                className="w-full h-full"
              />
            </motion.div>
          </div>
          <div className="lg:col-span-5 lg:sticky lg:top-32">
            <BlurText
              text="Founded in 2006 by Aruna Vance in a small Bandra walk-up, Nanma began as a conviction — that a residential developer could behave more like an architect's atelier than a corporate machine."
              className="body-lg block"
              delay={0.3}
            />
            <BlurText
              text="Today we work on three projects at a time, in just a handful of cities. We design every plan in-house, oversee every site weekly, and personally meet every buyer. It is, by design, a small practice."
              className="body block mt-6"
              delay={0.5}
            />
          </div>
        </div>
      </section>

      {/* MISSION + VISION */}
      <section className="py-24 md:py-32 bg-cream">
        <div className="container-x">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-line">
            {[
              { Icon: PiCompass, eyebrow: "Mission", title: "Build homes that outlive their buyers.", desc: "Every Nanma residence is designed to be stewarded for generations — using materials, methods, and craft that improve, not deteriorate, with time." },
              { Icon: PiTarget, eyebrow: "Vision", title: "A new standard for Indian luxury.", desc: "To redefine what 'luxury real estate' means in India — moving the conversation from chrome and marble to quiet conviction and architectural integrity." },
            ].map((b, i) => (
              <motion.div
                key={b.eyebrow}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-5% 0px" }}
                transition={{ duration: 0.7, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }}
                className="bg-cream p-10 md:p-14 lg:p-16 group hover:bg-pearl transition-colors duration-500"
              >
                <b.Icon className="w-12 h-12 text-terracotta mb-8 group-hover:scale-110 transition-transform duration-500" />
                <span className="number-tag block mb-3">({b.eyebrow})</span>
                <h3 className="display-3 text-graphite mb-5">{b.title}</h3>
                <p className="body">{b.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* COUNTERS */}
      <section className="py-24 md:py-32 bg-graphite text-bone overflow-hidden grain">
        <div className="container-x">
          <div className="max-w-3xl mb-12">
            <span className="eyebrow text-bone/50 mb-5">
              <span className="text-terracotta editorial italic normal-case text-base">(Numbers)</span>
              <span className="ml-2">Two decades, counted carefully</span>
            </span>
            <h2 className="display-2 !text-bone mt-6">
              <SplitText text="Built on " splitBy="word" stagger={0.06} />
              <span className="editorial text-terracotta">
                <SplitText text="trust." splitBy="char" stagger={0.05} delay={0.3} />
              </span>
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-bone/10">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10% 0px" }}
                transition={{ duration: 0.7, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="bg-graphite p-8 md:p-10 group"
              >
                <div className="font-display text-5xl md:text-6xl lg:text-7xl text-bone font-light tracking-tightest group-hover:text-terracotta transition-colors duration-500">
                  <Counter to={s.value} prefix={s.prefix || ""} suffix={s.suffix || ""} duration={2.4} />
                </div>
                <div className="text-xs uppercase tracking-ultrawide text-bone/60 mt-4">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* TIMELINE */}
      <section className="py-24 md:py-32">
        <div className="container-x">
          <div className="max-w-2xl mb-16">
            <span className="eyebrow mb-4">
              <span className="number-tag">(History)</span> A short timeline
            </span>
            <h2 className="display-2 mt-6">
              <SplitText text="Two decades of " splitBy="word" stagger={0.06} />
              <br />
              <span className="editorial text-terracotta">
                <SplitText text="quiet conviction." splitBy="word" stagger={0.06} delay={0.3} />
              </span>
            </h2>
          </div>

          <div className="relative">
            <div className="absolute left-[50px] md:left-1/2 top-0 bottom-0 w-px bg-line md:-translate-x-1/2" />
            <div className="space-y-10 md:space-y-16">
              {timeline.map((item, i) => (
                <motion.div
                  key={item.year}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-5% 0px" }}
                  transition={{ duration: 0.7, delay: 0.05 * i, ease: [0.16, 1, 0.3, 1] }}
                  className={`relative flex md:items-center gap-8 ${
                    i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                >
                  <div className="flex-1 pl-24 md:pl-0 md:px-12">
                    <div className="font-display text-4xl md:text-5xl text-terracotta font-light tracking-tighter2 mb-2">
                      {item.year}
                    </div>
                    <h3 className="font-display text-xl md:text-2xl text-graphite font-light mb-2">
                      {item.title}
                    </h3>
                    <p className="text-sm text-smoke max-w-md">{item.desc}</p>
                  </div>

                  <div className="absolute left-[50px] md:left-1/2 md:-translate-x-1/2 top-2 w-3 h-3 rounded-full bg-terracotta ring-4 ring-bone" />

                  <div className="hidden md:block flex-1" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ACHIEVEMENTS */}
      <section className="py-20 md:py-24 bg-cream">
        <div className="container-x">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <span className="eyebrow mb-5">
                <span className="number-tag">(Recognition)</span> Achievements
              </span>
              <h2 className="display-2 mt-6">
                <SplitText text="Quietly " splitBy="word" stagger={0.06} />
                <span className="editorial text-terracotta">
                  <SplitText text="acknowledged." splitBy="char" stagger={0.04} delay={0.3} />
                </span>
              </h2>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {achievements.map((a, i) => (
              <motion.div
                key={a.label}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-5% 0px" }}
                transition={{ duration: 0.6, delay: i * 0.08 }}
                className="bg-bone p-6 md:p-8 rounded-sm flex items-center gap-5 group hover:bg-pearl transition-colors"
              >
                <a.Icon className="w-8 h-8 text-terracotta shrink-0 group-hover:scale-110 transition-transform" />
                <span className="text-sm md:text-base text-graphite">{a.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* TEAM */}
      <section className="py-24 md:py-32">
        <div className="container-x">
          <div className="max-w-2xl mb-16">
            <span className="eyebrow mb-5">
              <span className="number-tag">(Atelier)</span> The team
            </span>
            <h2 className="display-2 mt-6">
              <SplitText text="People behind " splitBy="word" stagger={0.06} />
              <br />
              <span className="editorial text-terracotta">
                <SplitText text="the practice." splitBy="word" stagger={0.06} delay={0.3} />
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10">
            {team.map((m, i) => (
              <motion.div
                key={m.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-5% 0px" }}
                transition={{ duration: 0.7, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="group"
                data-cursor="hover"
              >
                <LazyImage
                  src={m.img}
                  alt={m.name}
                  className="aspect-[3/4] rounded-sm mb-4"
                  imgClassName="grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                />
                <h3 className="font-display text-lg md:text-xl text-graphite group-hover:text-terracotta transition-colors duration-300">
                  {m.name}
                </h3>
                <p className="text-xs md:text-sm text-smoke mt-1">{m.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* PHILOSOPHY CTA */}
      <section className="py-24 md:py-32 bg-cream">
        <div className="container-x text-center max-w-4xl mx-auto">
          <PiHandshake className="w-12 h-12 text-terracotta mx-auto mb-8" />
          <h2 className="display-2">
            <SplitText text="Every home we build, " splitBy="word" stagger={0.06} />
            <br />
            <span className="editorial text-terracotta">
              <SplitText text="we'd live in ourselves." splitBy="word" stagger={0.06} delay={0.4} />
            </span>
          </h2>
        </div>
      </section>
    </PageTransition>
  );
}
