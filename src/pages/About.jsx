import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { PiCompass, PiTarget, PiShield, PiChartLine, PiTimer, PiHandshake } from "react-icons/pi";
import SplitText from "../animations/SplitText";
import BlurText from "../animations/BlurText";
import Counter from "../animations/Counter";
import PageTransition from "../components/layout/PageTransition";
import SEO from "../components/ui/SEO";
import LazyImage from "../components/ui/LazyImage";

const timeline = [
  {
    year: "2012",
    title: "Nanma is Founded",
    desc: "Built on the rich lineage of Group Meeran, Nanma is established — the culmination of a dream over a decade in the making.",
  },
  {
    year: "2015",
    title: "Integrated Build Model",
    desc: "Our design-build capability takes shape, creating a single point of accountability from strategic analysis and design through to construction handover.",
  },
  {
    year: "2019",
    title: "Three Decades of Expertise",
    desc: "Our in-house multidisciplinary team spanning architecture, engineering and construction brings over 30 years of combined industry experience to every project.",
  },
  {
    year: "2022",
    title: "Reviving Stalled Projects",
    desc: "We leverage our financial strengths to help broken construction dreams see the light of day — reaffirming that construction is, above all, a social responsibility.",
  },
  {
    year: String(new Date().getFullYear()),
    title: "Building Tomorrow",
    desc: "Continuing to bring Nanma to our clients through zero tolerance, value engineering, and turnaround times up to one-third that of our competitors.",
  },
];

const approach = [
  {
    Icon: PiShield,
    title: "Zero Tolerance",
    desc: "Stringent implementation of best practices. We are willing to go back to the drawing board at any stage to deliver on our clients' vision — without compromise.",
  },
  {
    Icon: PiChartLine,
    title: "Value Engineering",
    desc: "Highest quality services at the lowest rates in the market. We ensure the highest value to every customer through rigorous value analysis at every phase.",
  },
  {
    Icon: PiTimer,
    title: "Fast Track Construction",
    desc: "Our design-build capability enables single-point accountability for end-to-end execution. Our turnaround times are up to one-third that of our competitors.",
  },
];

const team = [
  {
    name: "Navas Meeran",
    role: "Chairman",
    quote: "Meeran Group has always believed in providing the finest quality products and services at the most affordable prices. Through Nanma we now extend the goodness in the construction sector.",
    img: "/team/chairman.jpg",
  },
  {
    name: "Asheen Panakkat",
    role: "Managing Director",
    quote: "We bring in value to our customers through our openness and vast experience in the industry.",
    img: "/team/md.png",
  },
  {
    name: "Mohamed Junaid",
    role: "Director",
    quote: "Nanma for us is not just a business venture, it is a way of giving back goodness to society.",
    img: "/team/director.jpg",
  },
];

const stats = [
  { value: 14, suffix: "+", label: "Years in Practice" },
  { value: 44, suffix: "", label: "Projects Delivered" },
  { value: 98, suffix: "%", label: "Client Retention" },
];

export default function About() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start end", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  return (
    <PageTransition>
      <SEO
        title="About Nanma Properties — Our Story & Practice"
        description="Since our inception in 2012, Nanma Properties has delivered integrated building solutions with absolute single-source accountability — built on the rich lineage of Group Meeran."
        url="https://nanmaconstruct.com/about"
      />

      {/* HERO */}
      <section className="pt-32 md:pt-44 pb-12">
        <div className="container-x">
          {/* <span className="eyebrow mt-12">
            <span className="number-tag">(About)</span> Our practice
          </span> */}
          <h1 className="display-1 mt-6 max-w-[18ch] text-balance">
            <SplitText text="Built on the lineage " splitBy="word" stagger={0.06} />
            <br />
            <span className="editorial text-terracotta">
              <SplitText text="of Group " splitBy="word" stagger={0.06} delay={0.4} />
            </span>
            <SplitText text="Meeran." splitBy="word" stagger={0.06} delay={0.7} />
          </h1>
        </div>
      </section>

      {/* INTRO IMAGE + COPY */}
      <section ref={heroRef} className="pb-24 md:pb-32">
        <div className="container-x grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          <div className="lg:col-span-7 relative aspect-[16/10] overflow-hidden rounded-sm grain">
            <motion.div style={{ y: heroY }} className="absolute inset-0 w-full h-[115%] -top-[8%]">
              <LazyImage
                src="/image1.webp"
                alt="Nanma Properties"
                className="w-full h-full"
              />
            </motion.div>
          </div>
          <div className="lg:col-span-5 lg:sticky lg:top-32">
            <BlurText
              text="We are the culmination of a dream over a decade in the making. Our integrated building solutions ensure absolute single-source accountability — from strategic analysis and cutting-edge design, to contracting, construction and collaborative building."
              className="body-lg block"
              delay={0.3}
            />
            <BlurText
              text="Our in-house team of multidisciplinary experts in architecture, engineering and construction brings over three decades of rich experience — giving us a diverse perspective to better understand and build on our clients' vision."
              className="body block mt-6"
              delay={0.5}
            />
            <BlurText
              text="We aren't just building structures that redefine cityscapes — we are shaping society. After all, there's Nanma in all of us."
              className="body block mt-6 italic text-terracotta"
              delay={0.7}
            />
          </div>
        </div>
      </section>

      {/* MISSION + VISION */}
      <section className="py-24 md:py-32 bg-cream">
        <div className="container-x">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-line">
            {[
              {
                Icon: PiCompass,
                eyebrow: "Mission",
                title: "Single-source accountability, start to finish.",
                desc: "Our integrated building solutions span strategic analysis, cutting-edge design, contracting and construction — ensuring perfect harmony across every facet of your project under one roof.",
              },
              {
                Icon: PiTarget,
                eyebrow: "Vision",
                title: "Superior quality. Unmatched value. Social responsibility.",
                desc: "Since 2012, we have strived to provide superior quality construction at highly competitive prices — leveraging our financial strengths to help stalled projects and broken construction dreams see the light of day.",
              },
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
                <span className="number-tag block mb-3">{b.eyebrow}</span>
                <h3 className="display-3 text-graphite mb-5">{b.title}</h3>
                <p className="body">{b.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* APPROACH */}
      <section className="py-24 md:py-32">
        <div className="container-x">
          <div className="max-w-2xl mb-16">
            <span className="eyebrow mb-5">
              How we work
            </span>
            <h2 className="display-2 mt-6">
              <SplitText text="Our " splitBy="word" stagger={0.06} />
              <span className="editorial text-terracotta">
                <SplitText text="approach." splitBy="char" stagger={0.04} delay={0.2} />
              </span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-line">
            {approach.map((a, i) => (
              <motion.div
                key={a.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-5% 0px" }}
                transition={{ duration: 0.7, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }}
                className="bg-bone p-10 md:p-12 group hover:bg-pearl transition-colors duration-500"
              >
                <a.Icon className="w-10 h-10 text-terracotta mb-7 group-hover:scale-110 transition-transform duration-500" />
                <h3 className="font-display text-xl md:text-2xl text-graphite font-light mb-4 group-hover:text-terracotta transition-colors duration-300">
                  {a.title}
                </h3>
                <p className="body">{a.desc}</p>
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
              <span className="ml-2">Over a decade, counted carefully</span>
            </span>
            <h2 className="display-2 !text-bone mt-6">
              <SplitText text="Built on " splitBy="word" stagger={0.06} />
              <span className="editorial text-terracotta">
                <SplitText text="trust." splitBy="char" stagger={0.05} delay={0.3} />
              </span>
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-bone/2">
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

      {/* TEAM */}
      <section className="py-24 md:py-32 bg-cream">
        <div className="container-x">
          <div className="max-w-2xl mb-16">
            <span className="eyebrow mb-5">
              <span className="number-tag">Leadership</span>
            </span>
            <h2 className="display-2 mt-6">
              <SplitText text="People behind " splitBy="word" stagger={0.06} />
              <br />
              <span className="editorial text-terracotta">
                <SplitText text="the practice." splitBy="word" stagger={0.06} delay={0.3} />
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-14">
            {team.map((m, i) => (
              <motion.div
                key={m.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-5% 0px" }}
                transition={{ duration: 0.7, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
                className="group"
              >
                <div className="aspect-[3/4] overflow-hidden rounded-sm mb-6 bg-bone">
                  <img
                    src={m.img}
                    alt={m.name}
                    className="w-full h-full object-cover object-center grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                  />
                </div>
                <h3 className="font-display text-xl md:text-2xl text-graphite font-light group-hover:text-terracotta transition-colors duration-300">
                  {m.name}
                </h3>
                <p className="text-xs uppercase tracking-ultrawide text-terracotta mt-1 mb-4">{m.role}</p>
                <p className="text-sm text-smoke leading-relaxed italic">"{m.quote}"</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* TIMELINE */}
      {/* <section className="py-24 md:py-32">
        <div className="container-x">
          <div className="max-w-2xl mb-16">
            <span className="eyebrow mb-4">
              <span className="number-tag">(History)</span> A short timeline
            </span>
            <h2 className="display-2 mt-6">
              <SplitText text="A decade of " splitBy="word" stagger={0.06} />
              <br />
              <span className="editorial text-terracotta">
                <SplitText text="quiet conviction." splitBy="word" stagger={0.06} delay={0.3} />
              </span>
            </h2>
          </div>

          <div className="relative">
            {timeline.map((item, i) => (
              <motion.div
                key={item.year}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-5% 0px" }}
                transition={{ duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              >
  =
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-2.5 h-2.5 rounded-full bg-terracotta shrink-0" />
                  <div className="flex-1 h-px bg-line" />
                </div>

               
                <div className="grid grid-cols-1 md:grid-cols-[10rem_1fr] gap-4 md:gap-12 pb-10 pl-[1.625rem]">
                  <div className="font-display text-3xl md:text-4xl text-terracotta font-light tracking-tight leading-none pt-1">
                    {item.year}
                  </div>
                  <div>
                    <h3 className="font-display text-xl md:text-2xl text-graphite font-light leading-snug mb-3">
                      {item.title}
                    </h3>
                    <p className="text-sm text-smoke leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}

     
            <div className="flex items-center gap-4">
              <div className="w-2.5 h-2.5 rounded-full border-2 border-terracotta shrink-0" />
              <div className="flex-1 h-px bg-line" />
            </div>
          </div>
        </div>
      </section> */}

      {/* AWARDS & CERTIFICATIONS */}
      <section className="py-24 md:py-32 bg-cream hidden">
        <div className="container-x">
          <div className="max-w-2xl mb-16">
            <span className="eyebrow mb-5">
              <span className="number-tag">Awards &amp; Certifications</span>
            </span>
            <h2 className="display-2 mt-6">
              <SplitText text="Certified for " splitBy="word" stagger={0.06} />
              <span className="editorial text-terracotta">
                <SplitText text="excellence." splitBy="char" stagger={0.04} delay={0.3} />
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
            {[
              { src: "https://static.wixstatic.com/media/eff99e_ce7508e7c95e4ef9be8386a22ac326ae~mv2.jpg/v1/fill/w_516,h_715,al_c,lg_1,q_85,enc_avif,quality_auto/iso.jpg", alt: "ISO Certification" },
              { src: "https://static.wixstatic.com/media/eff99e_8b7c83e4bca74505889624ba70421ea4~mv2.jpg/v1/fill/w_526,h_398,al_c,lg_1,q_80,enc_avif,quality_auto/IGBC_edited.jpg", alt: "IGBC" },
              { src: "https://static.wixstatic.com/media/eff99e_19233cfecb5343cba2894461ee14b075~mv2.jpeg/v1/fill/w_538,h_744,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/ICL-%20ISO.jpeg", alt: "ICL ISO" },
              { src: "https://static.wixstatic.com/media/a51d8a_f340d3a0d4544a1bac834eda35c358b3~mv2.png/v1/fill/w_212,h_256,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/memeeranaward.png", alt: "Meeran Award" },
              { src: "https://static.wixstatic.com/media/a51d8a_f892cba9589e4fe9ac6d207389720d40~mv2.png/v1/fill/w_172,h_256,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/scarletaward.png", alt: "Scarlet Award" },
              { src: "https://static.wixstatic.com/media/a51d8a_4de57dd02c0c4aec95fd5742a8212347~mv2.png/v1/fill/w_192,h_256,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/phoenixaward.png", alt: "Phoenix Award" },
              { src: "https://static.wixstatic.com/media/a51d8a_3d202e3bab3c497d8876c31bc8cd04e5~mv2.png/v1/fill/w_126,h_256,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/fenixaward.png", alt: "Fenix Award" },
              { src: "https://static.wixstatic.com/media/a51d8a_c466cb3430444b06a5b3085497bf594e~mv2.png/v1/fill/w_192,h_280,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/nibaward.png", alt: "NIB Award" },
              { src: "https://static.wixstatic.com/media/a51d8a_56511d96338f4480bb75b627d02d5ba2~mv2.jpg/v1/crop/x_6,y_20,w_460,h_100/fill/w_566,h_120,al_c,lg_1,q_80,enc_avif,quality_auto/bfk_logo1.jpg", alt: "BFK" },
              { src: "https://static.wixstatic.com/media/a51d8a_c342330ffa5343248d2422ff2635dce4~mv2.png/v1/fill/w_240,h_360,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/appleaday.png", alt: "Apple a Day" },
              { src: "https://static.wixstatic.com/media/a51d8a_6c6b9c86ca2c4b69b780a08b1ac0992c~mv2.png/v1/fill/w_240,h_300,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/keralastateaward.png", alt: "Kerala State Award" },
            ].map((item, i) => (
              <motion.div
                key={item.alt}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-5% 0px" }}
                transition={{ duration: 0.6, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                className="group bg-white rounded-sm p-5 shadow-sm hover:shadow-md transition-all duration-500 flex items-center justify-center"
              >
                <img
                  src={item.src}
                  alt={item.alt}
                  className="w-full h-36 object-contain group-hover:scale-105 transition-transform duration-500"
                />
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
            <SplitText text="We aren't just building structures — " splitBy="word" stagger={0.06} />
            <br />
            <span className="editorial text-terracotta">
              <SplitText text="we are shaping society." splitBy="word" stagger={0.06} delay={0.5} />
            </span>
          </h2>
          <p className="body-lg mt-8 text-smoke">After all, there's Nanma in all of us.</p>
        </div>
      </section>
    </PageTransition>
  );
}
