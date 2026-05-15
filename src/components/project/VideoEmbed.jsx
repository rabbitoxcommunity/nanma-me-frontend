import { useState } from "react";
import { motion } from "framer-motion";
import { FiPlay } from "react-icons/fi";

export default function VideoEmbed({ src, title = "Project film", thumb }) {
  const [playing, setPlaying] = useState(false);

  return (
    <div className="relative aspect-video overflow-hidden rounded-sm bg-graphite">
      {!playing && thumb && (
        <button
          onClick={() => setPlaying(true)}
          data-cursor="hover"
          className="absolute inset-0 group"
          aria-label="Play video"
        >
          <img
            src={thumb}
            alt={title}
            loading="lazy"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-graphite/40 group-hover:bg-graphite/60 transition-colors duration-500" />
          <motion.div
            whileHover={{ scale: 1.1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="w-20 h-20 rounded-full bg-bone/95 flex items-center justify-center shadow-2xl">
              <FiPlay className="w-7 h-7 text-graphite ml-1" />
            </div>
          </motion.div>
        </button>
      )}
      {(playing || !thumb) && (
        <iframe
          src={`${src}${src.includes("?") ? "&" : "?"}autoplay=${playing ? 1 : 0}&rel=0&modestbranding=1`}
          title={title}
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 w-full h-full"
        />
      )}
    </div>
  );
}
