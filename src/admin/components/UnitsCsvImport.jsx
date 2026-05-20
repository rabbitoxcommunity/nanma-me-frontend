import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiUpload, FiX, FiDownload, FiAlertTriangle, FiCheckCircle,
} from "react-icons/fi";
import { Button } from "./ui";
import {
  parseUnitsCsv, downloadCsv, SAMPLE_UNITS_CSV,
} from "../utils/unitsCsv";
import { useToast } from "./Toast";

const STATUS_PILL = {
  available: "bg-emerald-50 text-emerald-700",
  booked:    "bg-amber-50 text-amber-700",
  sold:      "bg-cream text-graphite",
  blocked:   "bg-red-50 text-red-700",
};

export default function UnitsCsvImport({ open, onClose, existingCount, onApply }) {
  const toast = useToast();
  const fileRef = useRef();

  const [parsed, setParsed] = useState(null); // { rows, invalid, total } | null
  const [filename, setFilename] = useState("");
  const [mode, setMode] = useState("append"); // "append" | "replace"

  const reset = () => {
    setParsed(null);
    setFilename("");
    setMode("append");
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFilename(file.name);
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result || "";
      const result = parseUnitsCsv(String(text));
      setParsed(result);
      if (result.rows.length === 0) {
        toast.error("No valid rows found in the CSV.");
      }
    };
    reader.onerror = () => toast.error("Could not read the file.");
    reader.readAsText(file);
  };

  const handleApply = () => {
    if (!parsed?.rows.length) return;
    onApply(parsed.rows, mode);
    toast.success(
      mode === "replace"
        ? `Replaced with ${parsed.rows.length} units`
        : `Added ${parsed.rows.length} units`
    );
    handleClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-graphite/40 backdrop-blur-sm z-[80]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[90] flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl pointer-events-auto flex flex-col max-h-[90vh]">
              {/* Header */}
              <header className="flex items-start justify-between p-6 pb-4 border-b border-line">
                <div className="flex items-center gap-3">
                  <span className="w-9 h-9 rounded-xl bg-terracotta/10 flex items-center justify-center shrink-0">
                    <FiUpload className="w-4 h-4 text-terracotta" />
                  </span>
                  <div>
                    <h3 className="text-base font-semibold tracking-tight text-graphite">
                      Import units from CSV
                    </h3>
                    <p className="text-xs text-smoke mt-0.5">
                      Upload a spreadsheet — fast way to add hundreds of units at once.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleClose}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-smoke hover:text-graphite hover:bg-cream"
                  aria-label="Close"
                >
                  <FiX className="w-4 h-4" />
                </button>
              </header>

              {/* Body */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {!parsed ? (
                  <>
                    {/* File picker */}
                    <button
                      type="button"
                      onClick={() => fileRef.current?.click()}
                      className="w-full rounded-xl border-2 border-dashed border-[rgba(26,24,21,0.14)] hover:border-terracotta/40 hover:bg-cream/40 py-8 text-center transition-all"
                    >
                      <FiUpload className="w-6 h-6 text-ash mx-auto mb-2" />
                      <div className="text-sm font-medium text-graphite">Click to choose a CSV file</div>
                      <div className="text-xs text-smoke mt-1">
                        Headers: unitNumber, tower, floor, type, carpetArea, builtupArea, price, facing, view, status
                      </div>
                    </button>
                    <input
                      ref={fileRef}
                      type="file"
                      accept=".csv,text/csv"
                      onChange={handleFile}
                      className="hidden"
                    />

                    {/* Template */}
                    <div className="bg-cream/40 border border-line rounded-xl p-4 flex items-start gap-3">
                      <FiDownload className="w-4 h-4 text-terracotta shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm text-graphite font-medium">First time?</div>
                        <p className="text-xs text-smoke mt-0.5 leading-relaxed">
                          Download a sample CSV — open in Excel or Google Sheets,
                          fill your data, save as CSV, then import here.
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => downloadCsv("nanma-units-template.csv", SAMPLE_UNITS_CSV)}
                      >
                        Download template
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Parse summary */}
                    <div className="flex items-center justify-between flex-wrap gap-3">
                      <div className="text-sm">
                        <span className="text-graphite font-medium">{filename}</span>
                        <span className="text-smoke ml-2">
                          · {parsed.rows.length} valid · {parsed.invalid.length} skipped
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={reset}
                        className="text-xs text-terracotta uppercase tracking-widest underline-hover"
                      >
                        Choose different file
                      </button>
                    </div>

                    {/* Invalid warning */}
                    {parsed.invalid.length > 0 && (
                      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start gap-3">
                        <FiAlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                        <div className="text-xs text-amber-800 leading-relaxed">
                          {parsed.invalid.length} row{parsed.invalid.length === 1 ? "" : "s"} skipped:
                          <ul className="mt-1 list-disc pl-4">
                            {parsed.invalid.slice(0, 5).map((iv) => (
                              <li key={iv.line}>
                                Line {iv.line}: {iv.reason}
                              </li>
                            ))}
                            {parsed.invalid.length > 5 && (
                              <li className="text-amber-700">
                                …and {parsed.invalid.length - 5} more
                              </li>
                            )}
                          </ul>
                        </div>
                      </div>
                    )}

                    {/* Preview table */}
                    {parsed.rows.length > 0 && (
                      <div className="rounded-xl border border-line overflow-hidden">
                        <div className="bg-cream/60 px-3 py-2 text-[10px] font-semibold uppercase tracking-widest text-smoke">
                          Preview · first {Math.min(parsed.rows.length, 5)} of {parsed.rows.length}
                        </div>
                        <div className="overflow-x-auto">
                          <table className="w-full text-xs">
                            <thead>
                              <tr className="bg-white border-b border-line text-left text-smoke">
                                {["Unit", "Tower", "Floor", "Type", "Price", "Status"].map((h) => (
                                  <th key={h} className="px-3 py-2 font-semibold whitespace-nowrap">{h}</th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {parsed.rows.slice(0, 5).map((r, i) => (
                                <tr key={i} className="border-b border-line last:border-b-0 bg-white">
                                  <td className="px-3 py-2 font-medium text-graphite">{r.unitNumber}</td>
                                  <td className="px-3 py-2 text-smoke">{r.tower || "—"}</td>
                                  <td className="px-3 py-2 text-smoke">{r.floor || "—"}</td>
                                  <td className="px-3 py-2 text-smoke">{r.type || "—"}</td>
                                  <td className="px-3 py-2 text-smoke whitespace-nowrap">{r.price || "—"}</td>
                                  <td className="px-3 py-2">
                                    <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-widest ${STATUS_PILL[r.status]}`}>
                                      {r.status}
                                    </span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    {/* Apply mode */}
                    {parsed.rows.length > 0 && existingCount > 0 && (
                      <div className="bg-cream/40 border border-line rounded-xl p-4 space-y-2">
                        <div className="text-xs font-semibold uppercase tracking-widest text-smoke mb-2">
                          You have {existingCount} existing unit{existingCount === 1 ? "" : "s"} — what should I do?
                        </div>
                        <label className="flex items-start gap-3 cursor-pointer">
                          <input
                            type="radio"
                            checked={mode === "append"}
                            onChange={() => setMode("append")}
                            className="mt-1 accent-terracotta"
                          />
                          <span className="text-sm">
                            <span className="text-graphite font-medium">Append</span>
                            <span className="text-smoke ml-1.5">
                              add {parsed.rows.length} to existing {existingCount} (total {existingCount + parsed.rows.length})
                            </span>
                          </span>
                        </label>
                        <label className="flex items-start gap-3 cursor-pointer">
                          <input
                            type="radio"
                            checked={mode === "replace"}
                            onChange={() => setMode("replace")}
                            className="mt-1 accent-terracotta"
                          />
                          <span className="text-sm">
                            <span className="text-graphite font-medium">Replace</span>
                            <span className="text-smoke ml-1.5">
                              delete all {existingCount} existing units and import {parsed.rows.length} fresh
                            </span>
                          </span>
                        </label>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Footer */}
              <footer className="border-t border-line p-5 flex items-center justify-end gap-2">
                <Button type="button" variant="ghost" onClick={handleClose}>
                  Cancel
                </Button>
                {parsed && parsed.rows.length > 0 && (
                  <Button type="button" onClick={handleApply}>
                    <FiCheckCircle className="w-3.5 h-3.5" />
                    Import {parsed.rows.length} unit{parsed.rows.length === 1 ? "" : "s"}
                  </Button>
                )}
              </footer>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
