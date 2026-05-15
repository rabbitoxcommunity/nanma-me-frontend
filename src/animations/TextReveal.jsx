import { useRef } from "react";
import { motion, useInView } from "framer-motion";

export default function TextReveal({
  children,
  className = "",
  delay = 0,
  duration = 0.9,
  once = true,
  direction = "up",
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once, margin: "-5% 0px" });

  const map = {
    up: { y: "110%", x: 0 },
    down: { y: "-110%", x: 0 },
    left: { x: "110%", y: 0 },
    right: { x: "-110%", y: 0 },
  };

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <motion.div
        initial={{ ...map[direction], opacity: 0 }}
        animate={inView ? { x: 0, y: 0, opacity: 1 } : {}}
        transition={{ duration, delay, ease: [0.16, 1, 0.3, 1] }}
      >
        {children}
      </motion.div>
    </div>
  );
}
