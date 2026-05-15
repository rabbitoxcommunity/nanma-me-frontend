import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

const isTouch = () =>
  typeof window !== "undefined" &&
  ("ontouchstart" in window || navigator.maxTouchPoints > 0);

export default function CustomCursor() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 480, damping: 36, mass: 0.45 });
  const sy = useSpring(y, { stiffness: 480, damping: 36, mass: 0.45 });

  const [variant, setVariant] = useState("default"); // default | hover | text
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (isTouch()) return;
    setEnabled(true);

    const move = (e) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };

    const over = (e) => {
      const t = e.target.closest("[data-cursor]");
      if (t) setVariant(t.getAttribute("data-cursor") || "hover");
      else setVariant("default");
    };

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", over);

    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", over);
    };
  }, [x, y]);

  if (!enabled) return null;

  const sizeMap = { default: 10, hover: 56, text: 28 };
  const colorMap = { default: "#1a1815", hover: "#c2562a", text: "#1a1815" };
  const size = sizeMap[variant] || 10;
  const color = colorMap[variant] || "#1a1815";

  return (
    <motion.div
      style={{
        x: sx,
        y: sy,
        translateX: "-50%",
        translateY: "-50%",
        width: size,
        height: size,
        backgroundColor: color,
      }}
      animate={{ width: size, height: size, backgroundColor: color }}
      transition={{ type: "spring", stiffness: 320, damping: 22 }}
      className="fixed top-0 left-0 rounded-full pointer-events-none z-[9999] mix-blend-difference"
      aria-hidden
    />
  );
}
