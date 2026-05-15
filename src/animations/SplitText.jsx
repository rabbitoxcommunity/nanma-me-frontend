import { useRef } from "react";
import { motion, useInView } from "framer-motion";

export default function SplitText({
  text = "",
  className = "",
  delay = 0,
  stagger = 0.04,
  duration = 0.8,
  once = true,
  splitBy = "char",
  as: Tag = "span",
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once, margin: "-5% 0px" });

  // For word mode: split into words, each word includes its trailing space.
  // The trailing space inside each span needs whiteSpace:"pre" to be preserved
  // (otherwise inline-block collapses it and words butt together).
  const items =
    splitBy === "word"
      ? text.split(" ").map((w, i, a) => (i < a.length - 1 ? w + " " : w))
      : text.split("");

  const container = {
    hidden: {},
    visible: { transition: { staggerChildren: stagger, delayChildren: delay } },
  };

  const item = {
    hidden: { y: "115%", opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <motion.span
      ref={ref}
      className={`inline-block ${className}`}
      variants={container}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      aria-label={text}
    >
      {items.map((c, i) => (
        <span
          key={i}
          className="inline-block overflow-hidden align-bottom"
          style={{ whiteSpace: "pre" }}
          aria-hidden="true"
        >
          <motion.span className="inline-block" variants={item}>
            {c}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}
