import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiChevronDown, FiX } from "react-icons/fi";

/**
 * Visual icon picker — renders a button showing the currently selected icon,
 * opens a grid popover so admins can pick by sight instead of memorising keys.
 *
 * Props:
 *   value     — selected icon key (string)
 *   catalog   — { [key]: { Icon, label } }
 *   onChange  — (newKey: string) => void
 *   placeholder — text shown when nothing selected
 */
export default function IconPicker({
  value,
  catalog = {},
  onChange,
  placeholder = "Choose icon",
}) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);

  // Close on outside click + Escape
  useEffect(() => {
    if (!open) return;
    const onDoc = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const selected = value && catalog[value];
  const SelectedIcon = selected?.Icon;
  const entries = Object.entries(catalog);

  return (
    <div ref={wrapRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full bg-white border border-line rounded px-3 py-2 text-sm outline-none focus:border-graphite hover:border-graphite/40 transition-colors flex items-center gap-2"
      >
        {SelectedIcon ? (
          <>
            <SelectedIcon className="w-4 h-4 text-terracotta shrink-0" />
            <span className="truncate text-graphite text-left flex-1">
              {selected.label}
            </span>
          </>
        ) : (
          <span className="truncate text-ash text-left flex-1">
            {placeholder}
          </span>
        )}
        {selected ? (
          <FiX
            onClick={(e) => {
              e.stopPropagation();
              onChange("");
            }}
            className="w-3.5 h-3.5 text-ash hover:text-red-500 shrink-0"
          />
        ) : (
          <FiChevronDown className="w-3.5 h-3.5 text-ash shrink-0" />
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute z-30 top-full left-0 right-0 mt-1.5 bg-white border border-line rounded-lg shadow-xl p-2 max-h-72 overflow-y-auto min-w-[260px]"
          >
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1">
              {entries.map(([key, { Icon, label }]) => {
                const isActive = key === value;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => {
                      onChange(key);
                      setOpen(false);
                    }}
                    title={label}
                    className={`flex flex-col items-center justify-center gap-1.5 p-2.5 rounded text-center transition-colors ${
                      isActive
                        ? "bg-terracotta/10 text-terracotta"
                        : "hover:bg-cream text-graphite"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-[10px] leading-tight uppercase tracking-wide">
                      {label}
                    </span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
