// Admin UI primitives

export function Card({ children, className = "" }) {
  return (
    <div className={`bg-white rounded-2xl shadow-[0_1px_4px_rgba(26,24,21,0.06),0_4px_16px_rgba(26,24,21,0.04)] ${className}`}>
      {children}
    </div>
  );
}

export function PageHeader({ title, subtitle, actions }) {
  return (
    <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
      <div>
        <h1 className="font-display text-3xl md:text-4xl font-light text-graphite leading-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="text-sm text-smoke mt-1.5">{subtitle}</p>
        )}
      </div>
      {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
    </header>
  );
}

export function Button({
  type = "button",
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...rest
}) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98]";
  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-5 py-2.5 text-sm",
  };
  const variants = {
    primary: "bg-terracotta text-white hover:bg-clay shadow-sm",
    ghost: "border border-[rgba(26,24,21,0.14)] text-graphite hover:bg-[rgba(26,24,21,0.04)]",
    danger: "bg-red-500 text-white hover:bg-red-600 shadow-sm",
    quiet: "text-smoke hover:text-graphite hover:bg-[rgba(26,24,21,0.04)]",
  };
  return (
    <button
      type={type}
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}

export function Input({ label, error, hint, className = "", ...props }) {
  return (
    <label className={`block ${className}`}>
      {label && (
        <span className="block text-xs font-semibold uppercase tracking-ultrawide text-smoke mb-2">
          {label}
        </span>
      )}
      <input
        {...props}
        className={`w-full bg-white border rounded-xl px-3.5 py-2.5 text-sm text-graphite outline-none transition-all placeholder:text-ash ${
          error
            ? "border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100"
            : "border-[rgba(26,24,21,0.14)] focus:border-terracotta/50 focus:ring-2 focus:ring-terracotta/10"
        }`}
      />
      {hint && !error && <span className="block text-xs text-smoke mt-1.5">{hint}</span>}
      {error && <span className="block text-xs text-red-500 mt-1.5">{error}</span>}
    </label>
  );
}

export function Textarea({ label, error, rows = 4, className = "", ...props }) {
  return (
    <label className={`block ${className}`}>
      {label && (
        <span className="block text-xs font-semibold uppercase tracking-ultrawide text-smoke mb-2">
          {label}
        </span>
      )}
      <textarea
        rows={rows}
        {...props}
        className={`w-full bg-white border rounded-xl px-3.5 py-2.5 text-sm text-graphite outline-none transition-all resize-y placeholder:text-ash ${
          error
            ? "border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100"
            : "border-[rgba(26,24,21,0.14)] focus:border-terracotta/50 focus:ring-2 focus:ring-terracotta/10"
        }`}
      />
      {error && <span className="block text-xs text-red-500 mt-1.5">{error}</span>}
    </label>
  );
}

export function Select({ label, error, options = [], className = "", ...props }) {
  return (
    <label className={`block ${className}`}>
      {label && (
        <span className="block text-xs font-semibold uppercase tracking-ultrawide text-smoke mb-2">
          {label}
        </span>
      )}
      <select
        {...props}
        className={`w-full bg-white border rounded-xl px-3.5 py-2.5 text-sm text-graphite outline-none transition-all cursor-pointer ${
          error
            ? "border-red-300 focus:border-red-400"
            : "border-[rgba(26,24,21,0.14)] focus:border-terracotta/50 focus:ring-2 focus:ring-terracotta/10"
        }`}
      >
        {options.map((o) =>
          typeof o === "string" ? (
            <option key={o} value={o}>{o}</option>
          ) : (
            <option key={o.value} value={o.value}>{o.label}</option>
          )
        )}
      </select>
      {error && <span className="block text-xs text-red-500 mt-1.5">{error}</span>}
    </label>
  );
}

export function FormField({ label, hint, error, children, className = "" }) {
  return (
    <div className={`block ${className}`}>
      {label && (
        <span className="block text-xs font-semibold uppercase tracking-ultrawide text-smoke mb-2">
          {label}
        </span>
      )}
      {children}
      {hint && !error && <span className="block text-xs text-smoke mt-1.5">{hint}</span>}
      {error && <span className="block text-xs text-red-500 mt-1.5">{error}</span>}
    </div>
  );
}

export function EmptyState({ title, message, action }) {
  return (
    <div className="text-center bg-white rounded-2xl border-2 border-dashed border-[rgba(26,24,21,0.1)] py-16 px-4">
      <div className="font-display text-2xl text-graphite">{title}</div>
      {message && (
        <p className="text-sm text-smoke mt-2 max-w-sm mx-auto leading-relaxed">{message}</p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

const STATUS_CONFIG = {
  ongoing:   { dot: "bg-amber-400",   pill: "bg-amber-50 text-amber-700" },
  ready:     { dot: "bg-emerald-400", pill: "bg-emerald-50 text-emerald-700" },
  completed: { dot: "bg-ash",         pill: "bg-cream text-smoke" },
  upcoming:  { dot: "bg-blue-400",    pill: "bg-blue-50 text-blue-700" },
  new:       { dot: "bg-terracotta",  pill: "bg-terracotta/10 text-terracotta" },
  contacted: { dot: "bg-amber-400",   pill: "bg-amber-50 text-amber-700" },
  closed:    { dot: "bg-ash",         pill: "bg-cream text-smoke" },
};

export function StatusPill({ status }) {
  const cfg = STATUS_CONFIG[status] || { dot: "bg-ash", pill: "bg-cream text-smoke" };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-widest ${cfg.pill}`}>
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${cfg.dot}`} />
      {status}
    </span>
  );
}
