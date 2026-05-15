import { useState } from "react";
import { motion } from "framer-motion";

export default function LazyImage({
  src,
  alt = "",
  className = "",
  imgClassName = "",
  aspect = "",
  decoding = "async",
  fetchpriority,
  onClick,
  children,
}) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div
      onClick={onClick}
      className={`relative overflow-hidden bg-cream ${aspect} ${className}`}
    >
      {/* Skeleton shimmer */}
      {!loaded && (
        <div className="absolute inset-0 bg-gradient-to-r from-cream via-pearl to-cream bg-[length:200%_100%] animate-[shimmer_1.6s_infinite_linear]" />
      )}

      <motion.img
        src={src}
        alt={alt}
        loading="lazy"
        decoding={decoding}
        fetchpriority={fetchpriority}
        onLoad={() => setLoaded(true)}
        initial={{ opacity: 0, scale: 1.05 }}
        animate={loaded ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className={`w-full h-full object-cover ${imgClassName}`}
      />
      {children}
    </div>
  );
}
