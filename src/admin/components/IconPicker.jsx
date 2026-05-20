import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiChevronDown, FiX, FiSearch } from "react-icons/fi";

/**
 * Visual icon picker — renders a button showing the currently selected icon,
 * opens a searchable grid popover so admins can pick by sight or by name.
 *
 * Props:
 *   value       — selected icon key (string)
 *   catalog     — { [key]: { Icon, label } }
 *   onChange    — (newKey: string) => void
 *   placeholder — text shown when nothing selected
 */
export default function IconPicker({
  value,
  catalog = {},
  onChange,
  placeholder = "Choose icon",
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const wrapRef = useRef(null);
  const searchRef = useRef(null);

  // Close on outside click + Escape
  useEffect(() => {
    if (!open) return;
    const onDoc = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // Focus search when popover opens
  useEffect(() => {
    if (open) {
      setQuery("");
      setTimeout(() => searchRef.current?.focus(), 50);
    }
  }, [open]);

  const selected = value && catalog[value];
  const SelectedIcon = selected?.Icon;

  const filtered = Object.entries(catalog).filter(([key, { label }]) =>
    !query || label.toLowerCase().includes(query.toLowerCase()) || key.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div ref={wrapRef} className="relative">
      {/* Trigger button */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full bg-white border border-line rounded px-3 py-2 text-sm outline-none focus:border-graphite hover:border-graphite/40 transition-colors flex items-center gap-2"
      >
        {SelectedIcon ? (
          <>
            <SelectedIcon className="w-4 h-4 text-terracotta shrink-0" />
            <span className="truncate text-graphite text-left flex-1">{selected.label}</span>
          </>
        ) : (
          <span className="truncate text-ash text-left flex-1">{placeholder}</span>
        )}
        {selected ? (
          <FiX
            onClick={(e) => { e.stopPropagation(); onChange(""); }}
            className="w-3.5 h-3.5 text-ash hover:text-red-500 shrink-0"
          />
        ) : (
          <FiChevronDown className="w-3.5 h-3.5 text-ash shrink-0" />
        )}
      </button>

      {/* Popover */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 top-full left-0 mt-2 bg-white border border-line rounded-xl shadow-2xl overflow-hidden"
            style={{ width: "360px" }}
          >
            {/* Search */}
            <div className="flex items-center gap-2 px-3 py-2.5 border-b border-line">
              <FiSearch className="w-3.5 h-3.5 text-ash shrink-0" />
              <input
                ref={searchRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search icons…"
                className="flex-1 text-sm text-graphite placeholder:text-ash outline-none bg-transparent"
              />
              {query && (
                <button type="button" onClick={() => setQuery("")}>
                  <FiX className="w-3.5 h-3.5 text-ash hover:text-graphite" />
                </button>
              )}
            </div>

            {/* Grid */}
            <div className="p-2 max-h-64 overflow-y-auto">
              {filtered.length === 0 ? (
                <p className="text-xs text-ash text-center py-6">No icons match "{query}"</p>
              ) : (
                <div className="grid grid-cols-4 gap-1">
                  {filtered.map(([key, { Icon, label }]) => {
                    const isActive = key === value;
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => { onChange(key); setOpen(false); }}
                        title={label}
                        className={`flex flex-col items-center justify-center gap-2 p-3 rounded-lg text-center transition-all ${
                          isActive
                            ? "bg-terracotta text-white"
                            : "hover:bg-cream text-graphite"
                        }`}
                      >
                        <Icon className="w-6 h-6 shrink-0" />
                        <span className="text-[10px] leading-tight font-medium">
                          {label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer count */}
            <div className="px-3 py-2 border-t border-line bg-[#F5F5F7]">
              <span className="text-[10px] text-ash">
                {filtered.length} of {Object.keys(catalog).length} icons
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
