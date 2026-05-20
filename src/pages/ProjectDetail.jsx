import { useState, useEffect } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiMapPin } from "react-icons/fi";
import {
  PiAirplaneTakeoff,
  PiGraduationCap,
  PiFirstAid,
  PiTrainSimple,
  PiShoppingBag,
  PiWaves,
  PiTree,
  PiBuildings,
  PiMapPin as PiPin,
} from "react-icons/pi";
import SplitText from "../animations/SplitText";
import BlurText from "../animations/BlurText";
import TextReveal from "../animations/TextReveal";
import PageTransition from "../components/layout/PageTransition";
import SEO from "../components/ui/SEO";
import ProjectGallery from "../components/project/ProjectGallery";
import SpecGrid from "../components/project/SpecGrid";
import VideoEmbed from "../components/project/VideoEmbed";
import InquiryForm from "../components/project/InquiryForm";
import ProjectCard from "../components/project/ProjectCard";
import { ProjectCardSkeleton } from "../components/ui/Skeleton";
import Skeleton from "../components/ui/Skeleton";
import SectionCTA from "../components/ui/SectionCTA";
import { amenityCatalog } from "../data/amenities";
import { projectsService } from "../services/projectsService";

// Auto-pick a relevant icon from the connectivity label so admin doesn't need
// to choose one — falls back to a generic pin when no keyword matches.
function pickConnectivityIcon(label = "") {
  const l = label.toLowerCase();
  if (/airport|flight|terminal/.test(l)) return PiAirplaneTakeoff;
  if (/school|college|university|education/.test(l)) return PiGraduationCap;
  if (/hospital|clinic|medical|healthcare/.test(l)) return PiFirstAid;
  if (/metro|train|station|railway/.test(l)) return PiTrainSimple;
  if (/mall|shop|market|retail/.test(l)) return PiShoppingBag;
  if (/beach|sea|marine|water|lake/.test(l)) return PiWaves;
  if (/park|garden|forest|green/.test(l)) return PiTree;
  if (/centre|center|city|downtown|business/.test(l)) return PiBuildings;
  return PiPin;
}

export default function ProjectDetail() {
  const { slug } = useParams();

  const [project, setProject] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setNotFound(false);
    setProject(null);
    setRelated([]);

    projectsService
      .getBySlug(slug)
      .then((p) => {
        if (!alive) return;
        if (!p) { setNotFound(true); setLoading(false); return; }
        setProject(p);
        return projectsService.related(slug, 3).then((items) => {
          if (alive) setRelated(items);
        });
      })
      .catch((err) => {
        if (!alive) return;
        if (err?.response?.status === 404) setNotFound(true);
        else setNotFound(true);
        setLoading(false);
      })
      .finally(() => {
        if (alive) setLoading(false);
      });

    return () => { alive = false; };
  }, [slug]);

  if (notFound) return <Navigate to="/projects" replace />;

  if (loading) return <ProjectDetailSkeleton />;

  const schema = {
    "@context": "https://schema.org",
    "@type": "Residence",
    name: project.title,
    description: project.description,
    address: { "@type": "PostalAddress", addressLocality: project.location },
    image: project.gallery,
  };

  return (
    <PageTransition>
      <SEO
        title={project.metaTitle || `${project.title} — ${project.location} | Nanma Properties`}
        description={project.metaDescription || project.description}
        url={`https://nanmaconstruct.com/projects/${project.slug}`}
        image={project.cover}
        type="article"
        schema={schema}
      />

      {/* HERO BANNER */}
      <section className="relative h-[80vh] min-h-[560px] overflow-hidden">
        <motion.div
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0"
        >
          <img src={project.cover} alt={project.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-graphite/30 via-graphite/10 to-graphite/80" />
        </motion.div>

        <div className="container-x absolute inset-0 z-10 flex flex-col justify-end pb-16 md:pb-20 text-bone">
          <Link
            to="/projects"
            data-cursor="hover"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-bone/70 hover:text-bone mb-8 self-start"
          >
            <span aria-hidden>←</span> All Projects
          </Link>

          <TextReveal>
            <span className="inline-flex items-center gap-3 text-xs uppercase tracking-ultrawide text-bone/80">
              <span className="w-8 h-px bg-terracotta" />
              {project.statusLabel} · {project.type}
            </span>
          </TextReveal>

          <h1 className="font-display font-light leading-[0.92] tracking-tightest mt-6">
            <SplitText
              text={project.title}
              splitBy="word"
              stagger={0.07}
              duration={0.9}
              className="text-5xl md:text-7xl lg:text-8xl block"
            />
          </h1>

          <BlurText
            text={project.tagline}
            className="text-lg md:text-2xl editorial italic text-bone/90 mt-6 max-w-2xl"
            duration={1.1}
            delay={0.6}
          />

          <div className="mt-10 flex flex-wrap items-center gap-8 text-sm">
            <span className="flex items-center gap-2">
              <FiMapPin className="w-4 h-4 text-terracotta" /> {project.location}
            </span>
            <span className="text-bone/50">·</span>
            <span>{project.units} · {project.sizeRange}</span>
            <span className="text-bone/50">·</span>
            <span className="text-terracotta">{project.priceFrom}</span>
          </div>
        </div>
      </section>

      {/* OVERVIEW */}
      <section className="py-20 md:py-28">
        <div className="container-x grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left — sticky heading so it doesn't create an empty gap with long content */}
          <div className="lg:col-span-4 lg:sticky lg:top-28">
            <span className="eyebrow mb-5">
              <span className="number-tag">(Overview)</span> About this project
            </span>
            <h2 className="display-3 mt-6">
              A residence,
              <br />
              <span className="editorial text-terracotta">redefined.</span>
            </h2>
          </div>

          {/* Right — description + specs table */}
          <div className="lg:col-span-7 lg:col-start-6">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-5% 0px" }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="prose-project body-lg break-words"
              dangerouslySetInnerHTML={{ __html: project.description || "" }}
            />
            {project.overview?.length > 0 && (
              <div className="mt-10 border-t border-l border-line grid grid-cols-2">
                {project.overview.map((row, i) => (
                  <motion.div
                    key={row.label}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                    className="px-5 py-5 border-r border-b border-line group"
                  >
                    <div className="text-xs uppercase tracking-ultrawide text-smoke mb-2">
                      {row.label}
                    </div>
                    <div className="font-display text-base md:text-lg font-medium text-graphite leading-tight group-hover:text-terracotta transition-colors duration-300">
                      {row.value}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* GALLERY */}
      {project.gallery?.length > 0 && (
        <section className="py-16 md:py-24 bg-cream">
          <div className="container-x">
            <div className="flex items-end justify-between mb-10 gap-6">
              <div>
                <span className="eyebrow mb-4">
                  <span className="number-tag">(Gallery)</span>
                </span>
                <h2 className="display-3 mt-4">
                  <SplitText text="Through the " splitBy="word" stagger={0.06} />
                  <span className="editorial text-terracotta">
                    <SplitText text="lens." splitBy="char" stagger={0.04} delay={0.3} />
                  </span>
                </h2>
              </div>
            </div>
            <ProjectGallery images={project.gallery} />
          </div>
        </section>
      )}

      {/* AMENITIES */}
      {project.amenities?.length > 0 && (
        <section className="py-20 md:py-28">
          <div className="container-x">
            <div className="max-w-2xl mb-12">
              <span className="eyebrow mb-4">
                <span className="number-tag">(Amenities)</span> What's included
              </span>
              <h2 className="display-3 mt-6">
                <SplitText text="Quietly luxurious " splitBy="word" stagger={0.06} />
                <span className="editorial text-terracotta">
                  <SplitText text="amenities." splitBy="char" stagger={0.04} delay={0.4} />
                </span>
              </h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5 md:gap-6">
              {project.amenities.map((amenity, i) => {
                // Backend stores [{icon, title}]; older static data may still be
                // raw strings, so handle both shapes gracefully.
                const iconKey = typeof amenity === "string" ? amenity : amenity.icon;
                const customTitle = typeof amenity === "string" ? null : amenity.title;
                const cat = amenityCatalog[iconKey];
                const Icon = cat?.icon;
                // Prefer the admin's custom title; fall back to catalog label,
                // then to the icon key itself if neither is set.
                const label = customTitle || cat?.label || iconKey;
                if (!label) return null;
                return (
                  <motion.div
                    key={`${iconKey}-${i}`}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-5% 0px" }}
                    transition={{ duration: 0.5, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                    className="bg-cream rounded-sm p-6 flex flex-col items-start gap-4 hover:bg-pearl transition-colors duration-300 group"
                  >
                    {Icon && (
                      <Icon className="w-8 h-8 text-terracotta group-hover:scale-110 transition-transform duration-500" />
                    )}
                    <span className="text-sm font-medium text-graphite">{label}</span>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* SPECIFICATIONS */}
      {project.specifications?.length > 0 && (
        <section className="py-20 md:py-28 bg-cream">
          <div className="container-x">
            <div className="max-w-2xl mb-12">
              <span className="eyebrow mb-4">
                <span className="number-tag">(Specifications)</span>
              </span>
              <h2 className="display-3 mt-6">
                <SplitText text="Crafted to " splitBy="word" stagger={0.06} />
                <span className="editorial text-terracotta">
                  <SplitText text="endure." splitBy="char" stagger={0.04} delay={0.3} />
                </span>
              </h2>
            </div>
            <SpecGrid specifications={project.specifications} />
          </div>
        </section>
      )}

      {/* APARTMENT VIDEO */}
      {project.videoUrl && (
        <section className="py-20 md:py-28">
          <div className="container-x">
            <div className="max-w-2xl mb-12">
              <span className="eyebrow mb-4">
                <span className="number-tag">(Film)</span> Walkthrough
              </span>
              <h2 className="display-3 mt-6">
                <SplitText text="A cinematic " splitBy="word" stagger={0.06} />
                <span className="editorial text-terracotta">
                  <SplitText text="tour." splitBy="char" stagger={0.04} delay={0.3} />
                </span>
              </h2>
            </div>
            <VideoEmbed src={project.videoUrl} title={`${project.title} walkthrough`} thumb={project.cover} />
          </div>
        </section>
      )}

      {/* LOCATION */}
      <section className="py-20 md:py-28 bg-bone">
        <div className="container-x">
          {/* ── Section header ───────────────────────── */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 md:mb-14">
            <div>
              <span className="eyebrow mb-4">
                <span className="number-tag">(Location)</span> Where we are
              </span>
              <h2 className="display-2 mt-5">
                Connected to <br />
                <span className="editorial text-terracotta">everything that matters.</span>
              </h2>
            </div>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(project.location)}`}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="hover"
              className="inline-flex items-center gap-2 text-sm font-medium text-graphite border-b border-graphite pb-0.5 hover:text-terracotta hover:border-terracotta transition-colors duration-300 self-start md:self-end shrink-0"
            >
              <FiMapPin className="w-4 h-4" />
              {project.location} — Get Directions →
            </a>
          </div>

          {/* ── CONNECTIVITY — minimal divided grid ────── */}
          {project.connectivity?.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-line border-y border-line mb-10 md:mb-12">
              {project.connectivity.map((l, i) => {
                const Icon = pickConnectivityIcon(l.label);
                return (
                  <motion.div
                    key={`${l.label}-${i}`}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-5% 0px" }}
                    transition={{ delay: i * 0.06, duration: 0.5 }}
                    className="py-7 md:py-8 px-5 md:px-7 group"
                  >
                    <Icon className="w-9 h-9 md:w-10 md:h-10 text-terracotta mb-6 transition-transform duration-500 group-hover:scale-110" />

                    {/* Place name — now the headline */}
                    <h3 className="font-display text-2xl md:text-3xl text-graphite leading-tight tracking-tighter2 mb-3">
                      {l.label}
                    </h3>

                    {/* Distance + time — supporting line */}
                    {(l.value || l.time) && (
                      <div className="text-xs text-smoke">
                        {l.value && (
                          <span className="font-medium text-graphite">{l.value}</span>
                        )}
                        {l.value && l.time && (
                          <span className="text-ash"> · </span>
                        )}
                        {l.time && (
                          <span className="font-editorial italic">{l.time}</span>
                        )}
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* ── Map + Form side by side ──────────────── */}
          <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 items-stretch">
            {/* Map */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-5% 0px" }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="w-full lg:w-[60%] overflow-hidden rounded-sm border border-line shrink-0"
            >
              {project.mapEmbed ? (
                <iframe
                  src={project.mapEmbed}
                  title={`${project.title} location`}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-[360px] lg:h-full min-h-[440px]"
                  allowFullScreen
                />
              ) : (
                <div className="h-[360px] lg:h-full min-h-[440px] flex flex-col items-center justify-center gap-3 bg-bone text-smoke">
                  <FiMapPin className="w-7 h-7" />
                  <span className="text-xs uppercase tracking-widest">Map coming soon</span>
                </div>
              )}
            </motion.div>

            {/* Inquiry form */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-5% 0px" }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="w-full lg:w-[40%]"
            >
              <InquiryForm projectTitle={project.title} projectId={project.id} />
            </motion.div>
          </div>
        </div>
      </section>

      {/* RELATED */}
      {related.length > 0 && (
        <section className="py-24 md:py-32">
          <div className="container-x">
            <div className="mb-14">
              <span className="eyebrow mb-5">
                <span className="number-tag">(More)</span> Related projects
              </span>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 md:gap-10 mt-6">
                <h2 className="display-2">
                  <SplitText text="You may " splitBy="word" stagger={0.06} />
                  <span className="editorial text-terracotta">
                    <SplitText text="also love." splitBy="word" stagger={0.06} delay={0.3} />
                  </span>
                </h2>
                <SectionCTA to="/projects">All projects</SectionCTA>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-14">
              {related.map((p, i) => (
                <ProjectCard key={p.slug} project={p} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}
    </PageTransition>
  );
}

function ProjectDetailSkeleton() {
  return (
    <PageTransition>
      <div className="relative h-[80vh] min-h-[560px]">
        <Skeleton className="w-full h-full rounded-none" />
      </div>
      <section className="py-20 md:py-28">
        <div className="container-x grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-5 space-y-4">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-10 w-3/4" />
          </div>
          <div className="lg:col-span-6 lg:col-start-7 space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
            <div className="grid grid-cols-2 gap-4 mt-8">
              {[0, 1, 2, 3].map((i) => <Skeleton key={i} className="h-12" />)}
            </div>
          </div>
        </div>
      </section>
      <section className="py-16 bg-cream">
        <div className="container-x">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14">
            {[0, 1, 2].map((i) => <ProjectCardSkeleton key={i} />)}
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
