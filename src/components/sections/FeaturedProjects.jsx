import { useEffect, useState } from "react";
import SplitText from "../../animations/SplitText";
import ProjectCard from "../project/ProjectCard";
import { ProjectCardSkeleton } from "../ui/Skeleton";
import SectionCTA from "../ui/SectionCTA";
import { projectsApi } from "../../admin/api/endpoints";
import { adaptProjects } from "../../utils/projectAdapter";

export default function FeaturedProjects() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError(false);
    // Try featured first, fall back to most-recent if none flagged.
    projectsApi
      .publicList({ featured: true, limit: 3 })
      .then(({ items }) => {
        if (!alive) return;
        if (items.length) {
          setItems(adaptProjects(items));
          setLoading(false);
        } else {
          return projectsApi
            .publicList({ limit: 3 })
            .then(({ items }) => {
              if (!alive) return;
              setItems(adaptProjects(items));
              setLoading(false);
            });
        }
      })
      .catch(() => {
        if (!alive) return;
        setError(true);
        setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, []);

  return (
    <section className="py-24 md:py-36">
      <div className="container-x">
        <div className="mb-14">
          <span className="eyebrow mb-5">
            <span className="number-tag">(02)</span> Featured Projects
          </span>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 md:gap-10 mt-6">
            <h2 className="display-2">
              <SplitText text="Limited editions, " splitBy="word" stagger={0.06} />
              <br />
              <span className="editorial text-terracotta">
                <SplitText text="quietly remarkable." splitBy="word" stagger={0.06} delay={0.3} />
              </span>
            </h2>
            <SectionCTA to="/projects">View all projects</SectionCTA>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14">
            {[0, 1, 2].map((i) => <ProjectCardSkeleton key={i} />)}
          </div>
        ) : error ? (
          <div className="text-center py-16 text-smoke">
            Unable to load projects right now.
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-16 text-smoke">
            New projects coming soon.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14">
            {items.map((p, i) => (
              <ProjectCard key={p.slug} project={p} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
