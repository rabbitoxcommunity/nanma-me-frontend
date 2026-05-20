import { useMemo, useState, useRef, useCallback } from "react";
import { FixedSizeList as List } from "react-window";
import {
  FiPlus, FiTrash2, FiSearch, FiUpload, FiDownload,
} from "react-icons/fi";
import { Button } from "./ui";
import UnitsCsvImport from "./UnitsCsvImport";
import { unitsToCsv, downloadCsv } from "../utils/unitsCsv";

const STATUS_OPTIONS = [
  { value: "available", label: "Available", dot: "bg-emerald-500", pill: "bg-emerald-50 text-emerald-700" },
  { value: "booked",    label: "Booked",    dot: "bg-amber-500",   pill: "bg-amber-50 text-amber-700" },
  { value: "sold",      label: "Sold",      dot: "bg-graphite",    pill: "bg-cream text-graphite" },
  { value: "blocked",   label: "Blocked",   dot: "bg-red-500",     pill: "bg-red-50 text-red-700" },
];

const blankUnit = {
  unitNumber: "", tower: "", floor: "", type: "",
  carpetArea: "", builtupArea: "", price: "",
  facing: "", view: "", status: "available",
};

// Fixed row heights for virtual scrolling.
// Item height (card) = ~210px on mobile, ~150px on md+
// We'll detect and pass a single height that works at typical widths.
const ITEM_HEIGHT = 188;          // px — single card incl. gap
const LIST_HEIGHT_PX = 640;       // px — internal scroll container
const VIRTUAL_THRESHOLD = 40;      // <=this count → plain map (no virtualisation)

export default function UnitsManager({ value, onChange }) {
  // Defensive: in case prop arrives as undefined / null / non-array.
  const items = Array.isArray(value) ? value : [];
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const [search, setSearch] = useState("");
  const [importOpen, setImportOpen] = useState(false);

  // Filtered list with the original index attached (so edits target the
  // right slot in the underlying array).
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const base = items.map((u, originalIdx) => ({ u, originalIdx }));
    if (!q) return base;
    return base.filter(({ u }) =>
      [u.unitNumber, u.tower, u.type, u.floor]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q))
    );
  }, [items, search]);

  // Mutators (stable via ref so virtual list rows don't re-bind every render)
  const update = useCallback((originalIdx, patch) => {
    const next = onChangeRef.current;
    next(items.map((u, idx) => (idx === originalIdx ? { ...u, ...patch } : u)));
  }, [items]);

  const remove = useCallback((originalIdx) => {
    onChangeRef.current(items.filter((_, idx) => idx !== originalIdx));
  }, [items]);

  const duplicate = useCallback((originalIdx) => {
    const dup = { ...items[originalIdx], unitNumber: "" };
    const next = [...items];
    next.splice(originalIdx + 1, 0, dup);
    onChangeRef.current(next);
  }, [items]);

  const add = () => {
    onChangeRef.current([...items, { ...blankUnit }]);
    setSearch("");
  };

  // CSV
  const handleImport = (newRows, mode) => {
    if (mode === "replace") {
      onChangeRef.current(newRows);
    } else {
      onChangeRef.current([...items, ...newRows]);
    }
    setSearch("");
  };

  const handleExport = () => {
    if (!items.length) return;
    const csv = unitsToCsv(items);
    const stamp = new Date().toISOString().slice(0, 10);
    downloadCsv(`nanma-units-${stamp}.csv`, csv);
  };

  // Stats (global, not filtered)
  const stats = STATUS_OPTIONS.map((s) => ({
    ...s,
    count: items.filter((u) => u.status === s.value).length,
  }));

  // Determine whether to virtualise
  const useVirtual = filtered.length > VIRTUAL_THRESHOLD;

  return (
    <div>
      {/* Top bar — stats + actions */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        {items.length > 0 ? (
          <div className="flex flex-wrap items-center gap-2">
            {stats.map((s) => (
              <span
                key={s.value}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-widest ${s.pill}`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                {s.label}{" "}
                <span className="opacity-70 tabular-nums">{s.count}</span>
              </span>
            ))}
          </div>
        ) : (
          <span className="text-xs text-smoke">No units added yet.</span>
        )}

        <div className="flex items-center gap-2 flex-wrap">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setImportOpen(true)}
            title="Import units from CSV"
          >
            <FiUpload className="w-3.5 h-3.5" /> Import CSV
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleExport}
            disabled={!items.length}
            title="Export current units as CSV"
          >
            <FiDownload className="w-3.5 h-3.5" /> Export
          </Button>
          <Button type="button" size="sm" onClick={add}>
            <FiPlus className="w-3.5 h-3.5" /> Add Unit
          </Button>
        </div>
      </div>

      {/* Empty state */}
      {items.length === 0 ? (
        <div className="space-y-2">
          <button
            type="button"
            onClick={add}
            className="w-full text-xs text-smoke hover:text-terracotta hover:bg-cream/60 bg-cream/30 border border-dashed border-line rounded p-4 text-center transition-colors"
          >
            No units yet — <span className="text-terracotta">click to add the first one</span>
          </button>
          <button
            type="button"
            onClick={() => setImportOpen(true)}
            className="w-full text-xs text-smoke hover:text-terracotta hover:bg-cream/60 bg-cream/30 border border-dashed border-line rounded p-4 text-center transition-colors flex items-center justify-center gap-1.5"
          >
            <FiUpload className="w-3.5 h-3.5" /> or bulk-import from a CSV spreadsheet
          </button>
        </div>
      ) : (
        <>
          {/* Search */}
          {items.length > 8 && (
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-3">
              <div className="relative flex-1">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-ash pointer-events-none" />
                <input
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by unit no., tower, floor, type…"
                  className="w-full bg-white border border-line hover:border-graphite/40 focus:border-graphite rounded-lg pl-9 pr-3 py-2 text-sm text-graphite outline-none placeholder:text-ash transition-colors"
                />
              </div>
              <span className="text-[11px] text-smoke tabular-nums whitespace-nowrap">
                {filtered.length === items.length
                  ? `${items.length} units`
                  : `${filtered.length} of ${items.length}`}
                {useVirtual && " · virtualised"}
              </span>
            </div>
          )}

          {filtered.length === 0 ? (
            <div className="text-center py-8 text-smoke text-sm">
              No units match "{search}".
              <button
                type="button"
                onClick={() => setSearch("")}
                className="ml-2 text-terracotta underline-hover text-xs uppercase tracking-widest"
              >
                Clear search
              </button>
            </div>
          ) : useVirtual ? (
            // Virtual scrolling for large lists — only renders visible rows.
            <div className="rounded-xl border border-line overflow-hidden bg-white">
              <List
                height={Math.min(LIST_HEIGHT_PX, filtered.length * ITEM_HEIGHT)}
                itemCount={filtered.length}
                itemSize={ITEM_HEIGHT}
                width="100%"
                itemData={{ filtered, update, remove, duplicate }}
                overscanCount={4}
              >
                {VirtualRow}
              </List>
            </div>
          ) : (
            // Plain map for small lists — better keyboard focus retention.
            <div className="space-y-3">
              {filtered.map(({ u, originalIdx }) => (
                <UnitCard
                  key={originalIdx}
                  unit={u}
                  originalIdx={originalIdx}
                  update={update}
                  remove={remove}
                  duplicate={duplicate}
                />
              ))}
            </div>
          )}

          {/* Footer add (only when small list — virtual list has its own scroll) */}
          {!useVirtual && (
            <button
              type="button"
              onClick={add}
              className="mt-3 w-full text-xs text-smoke hover:text-terracotta hover:bg-cream/60 bg-cream/30 border border-dashed border-line rounded-xl py-3 text-center transition-colors flex items-center justify-center gap-1.5"
            >
              <FiPlus className="w-3.5 h-3.5" /> Add another unit
            </button>
          )}
        </>
      )}

      {/* CSV import modal */}
      <UnitsCsvImport
        open={importOpen}
        onClose={() => setImportOpen(false)}
        existingCount={items.length}
        onApply={handleImport}
      />
    </div>
  );
}

// ─── Virtual row wrapper ───────────────────────────────
function VirtualRow({ index, style, data }) {
  const { filtered, update, remove, duplicate } = data;
  const { u, originalIdx } = filtered[index];
  return (
    <div style={style} className="px-3 py-1.5">
      <UnitCard
        unit={u}
        originalIdx={originalIdx}
        update={update}
        remove={remove}
        duplicate={duplicate}
      />
    </div>
  );
}

// ─── Single unit card ──────────────────────────────────
function UnitCard({ unit, originalIdx, update, remove, duplicate }) {
  const statusCfg = STATUS_OPTIONS.find((s) => s.value === unit.status) || STATUS_OPTIONS[0];
  return (
    <div className="rounded-xl border border-line bg-cream/40 p-4 space-y-3">
      {/* Header row */}
      <div className="flex items-center gap-3">
        <input
          value={unit.unitNumber || ""}
          onChange={(e) => update(originalIdx, { unitNumber: e.target.value })}
          placeholder="Unit no. (e.g. A-301)"
          className="flex-1 bg-white border border-line hover:border-graphite/40 focus:border-graphite rounded-lg px-3 py-2 text-sm font-semibold text-graphite outline-none placeholder:text-ash placeholder:font-normal transition-colors"
        />
        <select
          value={unit.status}
          onChange={(e) => update(originalIdx, { status: e.target.value })}
          className={`appearance-none cursor-pointer text-[11px] font-semibold uppercase tracking-widest px-3 py-2 rounded-lg border-0 ${statusCfg.pill}`}
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
        <button
          type="button"
          onClick={() => duplicate(originalIdx)}
          className="text-[10px] font-semibold text-smoke hover:text-graphite uppercase tracking-widest px-2 py-2 rounded-lg hover:bg-cream"
          title="Duplicate unit"
        >
          Copy
        </button>
        <button
          type="button"
          onClick={() => remove(originalIdx)}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-smoke hover:text-red-500 hover:bg-red-50 transition-colors"
          aria-label="Delete unit"
        >
          <FiTrash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Fields grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        <Field placeholder="Tower / Block"            value={unit.tower}       onChange={(e) => update(originalIdx, { tower: e.target.value })} />
        <Field placeholder="Floor"                    value={unit.floor}       onChange={(e) => update(originalIdx, { floor: e.target.value })} />
        <Field placeholder="Type (3 BHK)"             value={unit.type}        onChange={(e) => update(originalIdx, { type: e.target.value })} />
        <Field placeholder="Price"                    value={unit.price}       onChange={(e) => update(originalIdx, { price: e.target.value })} />
        <Field placeholder="Carpet area"              value={unit.carpetArea}  onChange={(e) => update(originalIdx, { carpetArea: e.target.value })} />
        <Field placeholder="Built-up area"            value={unit.builtupArea} onChange={(e) => update(originalIdx, { builtupArea: e.target.value })} />
        <Field placeholder="Facing (E / W / N / S)"   value={unit.facing}      onChange={(e) => update(originalIdx, { facing: e.target.value })} />
        <Field placeholder="View (Sea / Park…)"       value={unit.view}        onChange={(e) => update(originalIdx, { view: e.target.value })} />
      </div>
    </div>
  );
}

function Field({ value, onChange, placeholder }) {
  return (
    <input
      type="text"
      value={value || ""}
      onChange={onChange}
      placeholder={placeholder}
      className="bg-white border border-line hover:border-graphite/40 focus:border-graphite rounded-lg px-3 py-2 text-xs text-graphite outline-none placeholder:text-ash transition-colors min-w-0"
    />
  );
}
