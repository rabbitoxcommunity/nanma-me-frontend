// Admin UI primitives — Inter-only, tight typography, refined micro-interactions.

// ──────────────────────────────────────────────────────
// Surface
// ──────────────────────────────────────────────────────
export function Card({ children, className = "", as: Tag = "div", ...rest }) {
  return (
    <Tag
      {...rest}
      className={`bg-white rounded-2xl shadow-[0_1px_3px_rgba(26,24,21,0.04),0_4px_16px_rgba(26,24,21,0.04)] ${className}`}
    >
      {children}
    </Tag>
  );
}

// ──────────────────────────────────────────────────────
// Page header — Inter, semibold, refined hierarchy
// ──────────────────────────────────────────────────────
export function PageHeader({ title, subtitle, actions, eyebrow }) {
  return (
    <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-7">
      <div className="min-w-0">
        {eyebrow && (
          <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-terracotta mb-1.5">
            {eyebrow}
          </div>
        )}
        <h1 className="text-2xl md:text-[28px] font-semibold tracking-tight text-graphite leading-[1.15]">
          {title}
        </h1>
        {subtitle && (
          <p className="text-sm text-smoke mt-1.5 leading-relaxed">{subtitle}</p>
        )}
      </div>
      {actions && (
        <div className="flex items-center gap-2 shrink-0 flex-wrap">{actions}</div>
      )}
    </header>
  );
}

// ──────────────────────────────────────────────────────
// Section header inside a card
// ──────────────────────────────────────────────────────
export function SectionHeader({ title, hint, action, className = "" }) {
  return (
    <div className={`flex items-start justify-between gap-4 ${className}`}>
      <div className="min-w-0">
        <h2 className="text-base font-semibold tracking-tight text-graphite">
          {title}
        </h2>
        {hint && <p className="text-xs text-smoke mt-1 leading-relaxed">{hint}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

// ──────────────────────────────────────────────────────
// Buttons
// ──────────────────────────────────────────────────────
export function Button({
  type = "button",
  variant = "primary",
  size = "md",
  className = "",
  loading = false,
  children,
  ...rest
}) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-terracotta/40 whitespace-nowrap";
  const sizes = {
    xs: "px-2.5 py-1 text-[11px]",
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-5 py-2.5 text-sm",
  };
  const variants = {
    primary:
      "bg-terracotta text-white hover:bg-clay shadow-sm hover:shadow-md",
    secondary:
      "bg-graphite text-white hover:bg-ink shadow-sm hover:shadow-md",
    ghost:
      "border border-[rgba(26,24,21,0.12)] text-graphite hover:bg-[rgba(26,24,21,0.04)] hover:border-[rgba(26,24,21,0.2)]",
    danger:
      "bg-red-500 text-white hover:bg-red-600 shadow-sm hover:shadow-md",
    quiet:
      "text-smoke hover:text-graphite hover:bg-[rgba(26,24,21,0.04)]",
  };
  return (
    <button
      type={type}
      disabled={loading || rest.disabled}
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
      {...rest}
    >
      {loading && (
        <span
          className="w-3 h-3 rounded-full border-2 border-current border-r-transparent animate-spin"
          aria-hidden
        />
      )}
      {children}
    </button>
  );
}

// ──────────────────────────────────────────────────────
// Form fields
// ──────────────────────────────────────────────────────
const FIELD_LABEL =
  "block text-[11px] font-semibold uppercase tracking-[0.14em] text-smoke mb-1.5";

const FIELD_BASE =
  "w-full bg-white border rounded-xl px-3.5 py-2.5 text-sm text-graphite outline-none transition-all placeholder:text-ash";

const FIELD_OK =
  "border-[rgba(26,24,21,0.12)] hover:border-[rgba(26,24,21,0.2)] focus:border-terracotta/50 focus:ring-2 focus:ring-terracotta/15 focus:ring-offset-0";

const FIELD_ERR =
  "border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100";

export function Input({ label, error, hint, className = "", ...props }) {
  return (
    <label className={`block ${className}`}>
      {label && <span className={FIELD_LABEL}>{label}</span>}
      <input
        {...props}
        className={`${FIELD_BASE} ${error ? FIELD_ERR : FIELD_OK}`}
      />
      {hint && !error && (
        <span className="block text-[11px] text-smoke mt-1.5 leading-relaxed">
          {hint}
        </span>
      )}
      {error && (
        <span className="block text-[11px] text-red-500 mt-1.5">{error}</span>
      )}
    </label>
  );
}

export function Textarea({ label, error, hint, rows = 4, className = "", ...props }) {
  return (
    <label className={`block ${className}`}>
      {label && <span className={FIELD_LABEL}>{label}</span>}
      <textarea
        rows={rows}
        {...props}
        className={`${FIELD_BASE} resize-y leading-relaxed ${error ? FIELD_ERR : FIELD_OK}`}
      />
      {hint && !error && (
        <span className="block text-[11px] text-smoke mt-1.5">{hint}</span>
      )}
      {error && (
        <span className="block text-[11px] text-red-500 mt-1.5">{error}</span>
      )}
    </label>
  );
}

export function Select({ label, error, options = [], className = "", ...props }) {
  return (
    <label className={`block ${className}`}>
      {label && <span className={FIELD_LABEL}>{label}</span>}
      <div className="relative">
        <select
          {...props}
          className={`${FIELD_BASE} cursor-pointer appearance-none pr-10 ${error ? FIELD_ERR : FIELD_OK}`}
        >
          {options.map((o) =>
            typeof o === "string" ? (
              <option key={o} value={o}>{o}</option>
            ) : (
              <option key={o.value} value={o.value}>{o.label}</option>
            )
          )}
        </select>
        {/* Custom chevron */}
        <svg
          className="absolute right-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-ash pointer-events-none"
          viewBox="0 0 12 12"
          fill="none"
          aria-hidden
        >
          <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      {error && (
        <span className="block text-[11px] text-red-500 mt-1.5">{error}</span>
      )}
    </label>
  );
}

export function FormField({ label, hint, error, children, className = "" }) {
  return (
    <div className={`block ${className}`}>
      {label && <span className={FIELD_LABEL}>{label}</span>}
      {children}
      {hint && !error && (
        <span className="block text-[11px] text-smoke mt-1.5">{hint}</span>
      )}
      {error && (
        <span className="block text-[11px] text-red-500 mt-1.5">{error}</span>
      )}
    </div>
  );
}

// ──────────────────────────────────────────────────────
// Toggle (used for visibility checkboxes — nicer than raw checkbox)
// ──────────────────────────────────────────────────────
export function Toggle({ checked, onChange, label, hint, className = "" }) {
  return (
    <label className={`flex items-start gap-3 cursor-pointer group ${className}`}>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex shrink-0 w-9 h-5 rounded-full transition-colors mt-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-terracotta/40 focus-visible:ring-offset-2 ${
          checked ? "bg-terracotta" : "bg-[rgba(26,24,21,0.18)] group-hover:bg-[rgba(26,24,21,0.25)]"
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${
            checked ? "translate-x-4" : "translate-x-0"
          }`}
        />
      </button>
      <span className="flex-1 min-w-0">
        <span className="text-sm font-medium text-graphite block leading-tight">
          {label}
        </span>
        {hint && (
          <span className="block text-xs text-smoke mt-1 leading-relaxed">{hint}</span>
        )}
      </span>
    </label>
  );
}

// ──────────────────────────────────────────────────────
// Empty state
// ──────────────────────────────────────────────────────
export function EmptyState({ title, message, action, icon: Icon }) {
  return (
    <div className="text-center bg-white rounded-2xl border-2 border-dashed border-[rgba(26,24,21,0.1)] py-16 px-4">
      {Icon && (
        <div className="w-12 h-12 rounded-2xl bg-cream mx-auto mb-4 flex items-center justify-center text-ash">
          <Icon className="w-5 h-5" />
        </div>
      )}
      <div className="text-lg font-semibold tracking-tight text-graphite">
        {title}
      </div>
      {message && (
        <p className="text-sm text-smoke mt-1.5 max-w-sm mx-auto leading-relaxed">
          {message}
        </p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

// ──────────────────────────────────────────────────────
// Status pill
// ──────────────────────────────────────────────────────
const STATUS_CONFIG = {
  ongoing:   { dot: "bg-amber-400",   pill: "bg-amber-50 text-amber-700",     label: "Ongoing" },
  ready:     { dot: "bg-emerald-400", pill: "bg-emerald-50 text-emerald-700", label: "Ready" },
  completed: { dot: "bg-ash",         pill: "bg-cream text-smoke",            label: "Completed" },
  upcoming:  { dot: "bg-blue-400",    pill: "bg-blue-50 text-blue-700",       label: "Upcoming" },
  new:       { dot: "bg-terracotta",  pill: "bg-terracotta/10 text-terracotta", label: "New" },
  contacted: { dot: "bg-amber-400",   pill: "bg-amber-50 text-amber-700",     label: "Contacted" },
  closed:    { dot: "bg-ash",         pill: "bg-cream text-smoke",            label: "Closed" },
};

export function StatusPill({ status, withLabel = true }) {
  const cfg = STATUS_CONFIG[status] || {
    dot: "bg-ash",
    pill: "bg-cream text-smoke",
    label: status,
  };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-semibold uppercase tracking-[0.1em] ${cfg.pill}`}>
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${cfg.dot}`} />
      {withLabel && (cfg.label || status)}
    </span>
  );
}

// ──────────────────────────────────────────────────────
// Sticky bottom action bar (used by long forms)
// ──────────────────────────────────────────────────────
export function StickyActionBar({ children, className = "" }) {
  return (
    <div className={`sticky bottom-0 z-20 mt-8 -mx-5 sm:-mx-8 lg:-mx-10 px-5 sm:px-8 lg:px-10 py-4 bg-white/85 backdrop-blur-md border-t border-[rgba(26,24,21,0.08)] flex items-center justify-end gap-2 ${className}`}>
      {children}
    </div>
  );
}
