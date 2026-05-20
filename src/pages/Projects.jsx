import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import SplitText from "../animations/SplitText";
import BlurText from "../animations/BlurText";
import PageTransition from "../components/layout/PageTransition";
import SEO from "../components/ui/SEO";
import ProjectCard from "../components/project/ProjectCard";
import { ProjectCardSkeleton } from "../components/ui/Skeleton";
import { PROJECT_STATUSES } from "../utils/projectAdapter";
import { projectsService } from "../services/projectsService";

export default function Projects() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initial = searchParams.get("status") || "all";
  const [active, setActive] = useState(initial);

  const [allProjects, setAllProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError(false);
    projectsService
      .list({ limit: 100 })
      .then(({ items }) => {
        if (!alive) return;
        setAllProjects(items);
        setLoading(false);
      })
      .catch(() => {
        if (!alive) return;
        setError(true);
        setLoading(false);
      });
    return () => { alive = false; };
  }, []);

  useEffect(() => {
    const s = searchParams.get("status") || "all";
    setActive(s);
  }, [searchParams]);

  const handleTab = (key) => {
    setActive(key);
    if (key === "all") {
      searchParams.delete("status");
      setSearchParams(searchParams, { replace: true });
    } else {
      setSearchParams({ status: key }, { replace: true });
    }
  };

  const filtered = useMemo(
    () =>
      active === "all"
        ? allProjects
        : allProjects.filter((p) => p.status === active),
    [active, allProjects]
  );

  return (
    <PageTransition>
      <SEO
        title="Projects — Nanma By Meeran"
        description="Browse Nanma's curated portfolio of ongoing, ready-to-move-in, completed, and upcoming luxury residential projects."
        url="https://nanmaconstruct.com/projects"
      />

      {/* Header */}
      <section className="pt-32 md:pt-44 pb-12">
        <div className="container-x">
          <span className="eyebrow mt-12">
            <span className="number-tag">(Portfolio)</span> Curated 2026
          </span>
          <h1 className="display-1 mt-6 max-w-[14ch] text-balance">
            <SplitText text="Every project, " splitBy="word" stagger={0.05} />
            <br />
            <span className="editorial text-terracotta">
              <SplitText text="a singular voice." splitBy="word" stagger={0.05} delay={0.4} />
            </span>
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mt-12">
            <div className="md:col-span-6 md:col-start-7">
              <BlurText
                text="A small, hand-built portfolio of luxury residences — organised by status, so you can find what's launching, what's selling, and what's ready to move in."
                className="body-lg"
                delay={0.5}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <section className="sticky top-20 z-20 bg-bone/85 backdrop-blur-xl border-y border-line">
        <div className="container-x">
          <LayoutGroup>
            <div className="flex flex-wrap items-center gap-2 py-4 overflow-x-auto">
              {PROJECT_STATUSES.map((s) => {
                const count =
                  s.key === "all"
                    ? allProjects.length
                    : allProjects.filter((p) => p.status === s.key).length;
                const isActive = active === s.key;
                return (
                  <button
                    key={s.key}
                    onClick={() => handleTab(s.key)}
                    data-cursor="hover"
                    className="relative px-5 py-2.5 text-sm rounded-full transition-colors duration-300 whitespace-nowrap"
                  >
                    {isActive && (
                      <motion.span
                        layoutId="tab-bg"
                        className="absolute inset-0 bg-graphite rounded-full"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                    <span
                      className={`relative z-10 ${
                        isActive ? "text-bone" : "text-smoke hover:text-graphite"
                      }`}
                    >
                      {s.label}
                      <span className={`ml-2 text-[10px] ${isActive ? "text-bone/60" : "text-ash"}`}>
                        ({loading ? "…" : count})
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </LayoutGroup>
        </div>
      </section>

      {/* Grid */}
      <section className="py-16 md:py-24">
        <div className="container-x">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <ProjectCardSkeleton key={i} />
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-32">
              <div className="font-display text-3xl text-graphite">Unable to load projects.</div>
              <p className="text-smoke mt-3">Please check your connection and try again.</p>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              >
                {filtered.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14">
                    {filtered.map((p, i) => (
                      <ProjectCard key={p.slug} project={p} index={i} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-32">
                    <div className="font-display text-3xl text-graphite">
                      No projects in this category yet.
                    </div>
                    <p className="text-smoke mt-3">Please check back soon, or browse all projects.</p>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </section>
    </PageTransition>
  );
}
