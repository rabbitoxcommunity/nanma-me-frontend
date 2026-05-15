import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import LazyImage from "../ui/LazyImage";

const statusColors = {
  ongoing: "bg-terracotta/15 text-terracotta",
  ready: "bg-sage/20 text-sage",
  completed: "bg-graphite/10 text-graphite",
  upcoming: "bg-amber-500/15 text-amber-700",
};

export default function ProjectCard({ project, index = 0 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-5% 0px" });
  const [hover, setHover] = useState(false);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: (index % 3) * 0.1, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="group"
    >
      <Link to={`/projects/${project.slug}`} data-cursor="hover" className="block">
        <LazyImage
          src={project.thumb}
          alt={project.title}
          aspect="aspect-[4/5]"
          className="rounded-sm mb-5"
          imgClassName={`transition-transform duration-[1200ms] ease-out-expo ${hover ? "scale-[1.06]" : "scale-100"}`}
        >
          <div className="absolute top-4 left-4 flex gap-2 z-10">
            <span className="bg-bone/95 backdrop-blur-sm px-3 py-1.5 text-[10px] uppercase tracking-widest text-graphite rounded-full">
              {project.type}
            </span>
            <span className={`backdrop-blur-sm px-3 py-1.5 text-[10px] uppercase tracking-widest rounded-full ${statusColors[project.status]}`}>
              {project.statusLabel}
            </span>
          </div>

          <motion.div
            animate={{ scale: hover ? 1 : 0, opacity: hover ? 1 : 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="absolute bottom-4 right-4 w-12 h-12 rounded-full bg-bone flex items-center justify-center z-10"
          >
            <span className="text-graphite text-lg">→</span>
          </motion.div>
        </LazyImage>

        <div className="flex justify-between items-start gap-4">
          <div className="flex-1 min-w-0">
            <h3 className="font-display text-xl md:text-2xl font-light text-graphite group-hover:text-terracotta transition-colors duration-500 leading-tight">
              {project.title}
            </h3>
            <p className="text-sm text-smoke mt-1">{project.location}</p>
          </div>
          <div className="text-right shrink-0">
            <div className="font-display text-base text-graphite">{project.priceFrom}</div>
            <div className="text-xs text-smoke mt-1">{project.handover}</div>
          </div>
        </div>

        <div className="flex gap-5 text-xs text-smoke mt-4 pt-4 border-t border-line">
          <span>{project.units}</span>
          <span className="text-ash">·</span>
          <span>{project.sizeRange}</span>
        </div>
      </Link>
    </motion.div>
  );
}
