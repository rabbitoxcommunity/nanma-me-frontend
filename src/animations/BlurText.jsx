import { useRef } from "react";
import { motion, useInView } from "framer-motion";

export default function BlurText({
  text = "",
  className = "",
  delay = 0,
  duration = 1,
  blur = 14,
  once = true,
  as: Tag = "span",
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once, margin: "-8% 0px" });

  return (
    <Tag ref={ref} className={`inline-block ${className}`}>
      <motion.span
        className="inline-block"
        initial={{ filter: `blur(${blur}px)`, opacity: 0, y: 8 }}
        animate={inView ? { filter: "blur(0px)", opacity: 1, y: 0 } : {}}
        transition={{ duration, delay, ease: [0.16, 1, 0.3, 1] }}
      >
        {text}
      </motion.span>
    </Tag>
  );
}
