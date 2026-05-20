import { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import {
  FiCheckCircle, FiClock, FiSlash, FiMinus,
  FiChevronLeft, FiChevronRight,
} from "react-icons/fi";

const STATUS = {
  available: { label: "Available", Icon: FiCheckCircle, dot: "bg-emerald-500", chip: "bg-emerald-50 text-emerald-700" },
  booked:    { label: "Booked",    Icon: FiClock,       dot: "bg-amber-500",   chip: "bg-amber-50 text-amber-700" },
  sold:      { label: "Sold",      Icon: FiSlash,       dot: "bg-graphite",    chip: "bg-cream text-graphite" },
  blocked:   { label: "Blocked",   Icon: FiMinus,       dot: "bg-red-500",     chip: "bg-red-50 text-red-700" },
};

const STATUS_FILTERS = [
  { value: "all",       label: "All" },
  { value: "available", label: "Available" },
  { value: "booked",    label: "Booked" },
  { value: "sold",      label: "Sold" },
];

const PAGE_SIZE = 24;

export default function UnitAvailability({ inventory, projectTitle = "" }) {
  const [statusFilter, setStatusFilter] = useState("all");
  const [towerFilter, setTowerFilter] = useState("all");
  const [page, setPage] = useState(1);

  // Defensive guard
  const safeUnits = Array.isArray(inventory) ? inventory : [];

  // ─── Auto-detect towers ──────────────────────────
  const towers = useMemo(() => {
    const set = new Set(safeUnits.map((u) => u.tower?.trim()).filter(Boolean));
    return Array.from(set).sort();
  }, [safeUnits]);

  // ─── Status counts (across all towers — global summary) ─
  const counts = useMemo(() => {
    const c = { all: safeUnits.length, available: 0, booked: 0, sold: 0, blocked: 0 };
    safeUnits.forEach((u) => {
      if (c[u.status] !== undefined) c[u.status] += 1;
    });
    return c;
  }, [safeUnits]);

  // ─── Apply filters ───────────────────────────────
  const filtered = useMemo(() => {
    return safeUnits.filter((u) => {
      if (statusFilter !== "all" && u.status !== statusFilter) return false;
      if (towerFilter !== "all" && (u.tower || "").trim() !== towerFilter) return false;
      return true;
    });
  }, [safeUnits, statusFilter, towerFilter]);

  // Reset to page 1 whenever filters change
  useEffect(() => {
    setPage(1);
  }, [statusFilter, towerFilter]);

  // ─── Pagination slice ────────────────────────────
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageItems = useMemo(
    () => filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE),
    [filtered, safePage]
  );

  if (!safeUnits.length) return null;

  return (
    <section className="py-20 md:py-28 bg-bone">
      <div className="container-x">
        {/* ── Header ───────────────────────────── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 md:mb-12">
          <div>
            <span className="eyebrow mb-4">
              <span className="number-tag">(Inventory)</span> Availability
            </span>
            <h2 className="display-2 mt-5">
              Find <span className="editorial text-terracotta">your home</span>.
            </h2>
            <p className="body mt-4 max-w-md">
              Live inventory — sold, booked and available units across {projectTitle}. Reach out to lock yours.
            </p>
          </div>

          {/* Status totals strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 md:max-w-md">
            {["available", "booked", "sold", "blocked"].map((s) => {
              const cfg = STATUS[s];
              return (
                <div key={s} className="bg-white border border-line rounded-xl px-3 py-2.5">
                  <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-smoke">
                    <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                    {cfg.label}
                  </div>
                  <div className="font-display text-2xl text-graphite leading-tight tabular-nums mt-0.5">
                    {counts[s]}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Tower filter (only if >1 tower) ─────── */}
        {towers.length > 1 && (
          <div className="mb-4">
            <LayoutGroup id="tower-filter">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[11px] uppercase tracking-widest text-smoke font-semibold mr-2">
                  Tower:
                </span>
                {["all", ...towers].map((t) => {
                  const isActive = towerFilter === t;
                  const tcount =
                    t === "all"
                      ? safeUnits.length
                      : safeUnits.filter((u) => (u.tower || "").trim() === t).length;
                  return (
                    <button
                      key={t}
                      onClick={() => setTowerFilter(t)}
                      data-cursor="hover"
                      className="relative px-3.5 py-1.5 text-xs font-medium rounded-full transition-colors duration-300"
                    >
                      {isActive && (
                        <motion.span
                          layoutId="tower-bg"
                          className="absolute inset-0 bg-terracotta rounded-full"
                          transition={{ type: "spring", stiffness: 380, damping: 30 }}
                        />
                      )}
                      <span className={`relative z-10 inline-flex items-center gap-1.5 ${isActive ? "text-bone" : "text-smoke hover:text-graphite"}`}>
                        {t === "all" ? "All" : t}
                        <span className={`text-[10px] tabular-nums ${isActive ? "text-bone/70" : "text-ash"}`}>
                          {tcount}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </LayoutGroup>
          </div>
        )}

        {/* ── Status filter chips ─────────────────── */}
        <LayoutGroup id="status-filter">
          <div className="flex flex-wrap items-center gap-1.5 border-y border-line py-3 mb-6">
            {STATUS_FILTERS.map((f) => {
              const isActive = statusFilter === f.value;
              const sCount =
                f.value === "all"
                  ? filtered.length // shows count in current tower filter context
                  : safeUnits.filter(
                      (u) =>
                        u.status === f.value &&
                        (towerFilter === "all" || (u.tower || "").trim() === towerFilter)
                    ).length;
              return (
                <button
                  key={f.value}
                  onClick={() => setStatusFilter(f.value)}
                  data-cursor="hover"
                  className="relative px-4 py-1.5 text-xs font-medium rounded-full transition-colors duration-300 whitespace-nowrap"
                >
                  {isActive && (
                    <motion.span
                      layoutId="unit-filter-bg"
                      className="absolute inset-0 bg-graphite rounded-full"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className={`relative z-10 inline-flex items-center gap-1.5 ${isActive ? "text-bone" : "text-smoke hover:text-graphite"}`}>
                    {f.label}
                    <span className={`text-[10px] tabular-nums ${isActive ? "text-bone/60" : "text-ash"}`}>
                      {sCount}
                    </span>
                  </span>
                </button>
              );
            })}

            {/* Page-position summary on the right */}
            {filtered.length > PAGE_SIZE && (
              <span className="ml-auto text-[11px] text-smoke tabular-nums">
                Showing {(safePage - 1) * PAGE_SIZE + 1}
                –{Math.min(safePage * PAGE_SIZE, filtered.length)} of {filtered.length}
              </span>
            )}
          </div>
        </LayoutGroup>

        {/* ── Unit grid ────────────────────────────── */}
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-smoke">
            <p className="text-sm">No units match this filter.</p>
            <button
              onClick={() => {
                setStatusFilter("all");
                setTowerFilter("all");
              }}
              className="mt-3 text-xs text-terracotta uppercase tracking-widest underline-hover"
            >
              Clear filters →
            </button>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={`${statusFilter}-${towerFilter}-${safePage}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3"
            >
              {pageItems.map((u, i) => {
                const cfg = STATUS[u.status] || STATUS.available;
                const isUnavailable = u.status === "sold" || u.status === "blocked";
                return (
                  <motion.div
                    key={`${u.unitNumber}-${(safePage - 1) * PAGE_SIZE + i}`}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: (i % 10) * 0.02, duration: 0.3 }}
                    className={`relative bg-white border border-line rounded-xl p-4 transition-all duration-300 ${
                      isUnavailable
                        ? "opacity-65"
                        : "hover:border-terracotta/30 hover:-translate-y-0.5 hover:shadow-md hover:shadow-graphite/10"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className={`inline-flex items-center gap-1 text-[9px] font-semibold uppercase tracking-widest px-2 py-1 rounded-full ${cfg.chip}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                        {cfg.label}
                      </span>
                      {u.facing && (
                        <span className="text-[10px] text-ash uppercase tracking-widest">{u.facing}</span>
                      )}
                    </div>

                    <div className="font-display text-2xl text-graphite leading-none tracking-tighter2 mb-1.5">
                      {u.unitNumber}
                    </div>

                    <div className="text-[11px] text-smoke leading-relaxed mb-2 truncate">
                      {[u.type, u.tower, u.floor && `Floor ${u.floor}`].filter(Boolean).join(" · ")}
                    </div>

                    {(u.carpetArea || u.builtupArea) && (
                      <div className="text-[11px] text-ash truncate">
                        {u.carpetArea}
                        {u.carpetArea && u.builtupArea && " · "}
                        {u.builtupArea}
                      </div>
                    )}

                    {u.price && (
                      <div className="mt-3 pt-3 border-t border-line text-sm font-medium text-graphite">
                        {u.price}
                      </div>
                    )}

                    {u.view && (
                      <div className="text-[10px] text-ash uppercase tracking-widest mt-1">
                        {u.view} view
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </motion.div>
          </AnimatePresence>
        )}

        {/* ── Pagination controls ─────────────────── */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={safePage === 1}
              data-cursor="hover"
              aria-label="Previous page"
              className="w-9 h-9 rounded-full border border-line text-graphite hover:bg-graphite hover:text-bone hover:border-graphite disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
            >
              <FiChevronLeft className="w-4 h-4" />
            </button>

            {/* Page numbers */}
            {buildPageList(safePage, totalPages).map((p, i) =>
              p === "…" ? (
                <span key={`gap-${i}`} className="text-smoke text-xs px-2">
                  …
                </span>
              ) : (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  data-cursor="hover"
                  className={`min-w-9 h-9 px-3 rounded-full text-xs font-medium tabular-nums transition-colors ${
                    p === safePage
                      ? "bg-graphite text-bone"
                      : "text-smoke hover:bg-cream hover:text-graphite"
                  }`}
                >
                  {p}
                </button>
              )
            )}

            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={safePage === totalPages}
              data-cursor="hover"
              aria-label="Next page"
              className="w-9 h-9 rounded-full border border-line text-graphite hover:bg-graphite hover:text-bone hover:border-graphite disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
            >
              <FiChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

// Build a compact list of page numbers with ellipses for long ranges:
// 1, …, 5, 6, 7, …, 12
function buildPageList(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages = new Set([1, total, current, current - 1, current + 1]);
  const sorted = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);
  const out = [];
  let prev = 0;
  for (const p of sorted) {
    if (p - prev > 1) out.push("…");
    out.push(p);
    prev = p;
  }
  return out;
}
