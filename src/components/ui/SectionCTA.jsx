import { Link } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";

/**
 * Section "view all / see full" link — outlined pill with a sliding arrow.
 * Sits inline with section headlines; aligns vertically centred with the title.
 */
export default function SectionCTA({ to, children, className = "" }) {
  return (
    <Link
      to={to}
      data-cursor="hover"
      className={`group inline-flex items-center gap-2.5 border border-graphite text-graphite hover:bg-graphite hover:text-bone hover:border-graphite rounded-full px-6 py-3.5 text-[11px] font-semibold uppercase tracking-[0.22em] transition-colors duration-400 shrink-0 ${className}`}
    >
      {children}
      <span className="relative inline-block w-4 h-4 overflow-hidden">
        {/* Arrow slides right out — second arrow slides in from the left */}
        <FiArrowRight className="absolute inset-0 w-4 h-4 transition-transform duration-500 ease-out-expo group-hover:translate-x-5" />
        <FiArrowRight className="absolute inset-0 w-4 h-4 -translate-x-5 transition-transform duration-500 ease-out-expo group-hover:translate-x-0" />
      </span>
    </Link>
  );
}
