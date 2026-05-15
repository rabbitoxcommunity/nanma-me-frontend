import { useState, useEffect } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiMapPin } from "react-icons/fi";
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
import { amenityCatalog } from "../data/amenities";
import { projectsService } from "../services/projectsService";

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
        title={project.metaTitle || `${project.title} — ${project.location} | Nanma Estates`}
        description={project.metaDescription || project.description}
        url={`https://nanmaestates.com/projects/${project.slug}`}
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
        <div className="container-x grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          <div className="lg:col-span-5">
            <span className="eyebrow mb-5">
              <span className="number-tag">(Overview)</span> About this project
            </span>
            <h2 className="display-3 mt-6">
              A residence,
              <br />
              <span className="editorial text-terracotta">redefined.</span>
            </h2>
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <BlurText text={project.description} className="body-lg block" duration={1.2} />
            {project.overview?.length > 0 && (
              <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5 border-t border-line pt-10">
                {project.overview.map((row, i) => (
                  <motion.div
                    key={row.label}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.06 }}
                    className="flex justify-between border-b border-line pb-4"
                  >
                    <span className="text-xs uppercase tracking-ultrawide text-smoke">
                      {row.label}
                    </span>
                    <span className="text-sm text-graphite text-right font-medium">
                      {row.value}
                    </span>
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
              {project.amenities.map((key, i) => {
                const a = amenityCatalog[key];
                if (!a) return null;
                const Icon = a.icon;
                return (
                  <motion.div
                    key={key}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-5% 0px" }}
                    transition={{ duration: 0.5, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                    className="bg-cream rounded-sm p-6 flex flex-col items-start gap-4 hover:bg-pearl transition-colors duration-300 group"
                  >
                    <Icon className="w-8 h-8 text-terracotta group-hover:scale-110 transition-transform duration-500" />
                    <span className="text-sm font-medium text-graphite">{a.label}</span>
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

      {/* INQUIRY + MAP */}
      <section className="py-20 md:py-28 bg-graphite text-bone">
        <div className="container-x grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-7">
            <span className="eyebrow text-bone/50 mb-4">
              <span className="text-terracotta editorial italic normal-case text-base">(Location)</span>
              <span className="ml-2">On the map</span>
            </span>
            <h2 className="display-3 !text-bone mt-6 mb-8">
              {project.pinShort},
              <br />
              <span className="editorial text-terracotta">
                {project.location.split(",")[1]?.trim() || ""}
              </span>
            </h2>
            {project.mapEmbed && (
              <div className="aspect-[4/3] md:aspect-[16/10] overflow-hidden rounded-sm bg-bone/5">
                <iframe
                  src={project.mapEmbed}
                  title={`${project.title} location`}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full"
                  allowFullScreen
                />
              </div>
            )}
          </div>
          <div className="lg:col-span-5">
            <InquiryForm projectTitle={project.title} />
          </div>
        </div>
      </section>

      {/* RELATED */}
      {related.length > 0 && (
        <section className="py-24 md:py-32">
          <div className="container-x">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
              <div>
                <span className="eyebrow mb-5">
                  <span className="number-tag">(More)</span> Related projects
                </span>
                <h2 className="display-2 mt-6">
                  <SplitText text="You may " splitBy="word" stagger={0.06} />
                  <span className="editorial text-terracotta">
                    <SplitText text="also love." splitBy="word" stagger={0.06} delay={0.3} />
                  </span>
                </h2>
              </div>
              <Link to="/projects" data-cursor="hover" className="btn-link">
                All projects <span aria-hidden>→</span>
              </Link>
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
