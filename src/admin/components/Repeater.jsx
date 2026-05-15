import { FiPlus, FiTrash2 } from "react-icons/fi";
import { Button } from "./ui";

/**
 * Generic repeater. `fields` is an array of { name, label, type, placeholder }.
 * `value` is an array of objects matching those fields. `onChange(newArray)`.
 */
export default function Repeater({
  value = [],
  onChange,
  fields = [],
  label,
  addLabel = "Add",
  emptyMessage = "No items yet.",
}) {
  const update = (i, patch) => {
    const next = value.map((row, idx) => (idx === i ? { ...row, ...patch } : row));
    onChange(next);
  };
  const remove = (i) => onChange(value.filter((_, idx) => idx !== i));
  const add = () => {
    const blank = fields.reduce((acc, f) => ({ ...acc, [f.name]: "" }), {});
    onChange([...value, blank]);
  };

  return (
    <div>
      {label && (
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs uppercase tracking-ultrawide text-smoke">{label}</span>
          <Button type="button" variant="ghost" size="sm" onClick={add}>
            <FiPlus className="w-3.5 h-3.5" /> {addLabel}
          </Button>
        </div>
      )}

      {value.length === 0 ? (
        <div className="text-xs text-smoke bg-cream/40 border border-dashed border-line rounded p-4 text-center">
          {emptyMessage}
        </div>
      ) : (
        <div className="space-y-2">
          {value.map((row, i) => (
            <div
              key={i}
              className="grid grid-cols-1 md:grid-cols-[1fr_2fr_2fr_auto] gap-2 items-start bg-cream/40 border border-line rounded p-3"
            >
              {fields.map((f) => (
                <div key={f.name}>
                  {f.type === "textarea" ? (
                    <textarea
                      rows={2}
                      value={row[f.name] || ""}
                      onChange={(e) => update(i, { [f.name]: e.target.value })}
                      placeholder={f.placeholder || f.label}
                      className="w-full bg-white border border-line rounded px-3 py-2 text-sm outline-none focus:border-graphite resize-y"
                    />
                  ) : (
                    <input
                      value={row[f.name] || ""}
                      onChange={(e) => update(i, { [f.name]: e.target.value })}
                      placeholder={f.placeholder || f.label}
                      className="w-full bg-white border border-line rounded px-3 py-2 text-sm outline-none focus:border-graphite"
                    />
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => remove(i)}
                className="text-red-500 hover:text-red-700 self-start mt-1.5 p-2"
                aria-label="Remove"
              >
                <FiTrash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
