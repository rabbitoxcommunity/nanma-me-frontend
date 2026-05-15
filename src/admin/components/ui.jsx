// Tiny set of reusable admin UI primitives.

export function Card({ children, className = "" }) {
  return (
    <div className={`bg-white rounded shadow-sm border border-line ${className}`}>
      {children}
    </div>
  );
}

export function PageHeader({ title, subtitle, actions }) {
  return (
    <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
      <div>
        <h1 className="font-display text-3xl md:text-4xl font-light text-graphite">
          {title}
        </h1>
        {subtitle && <p className="text-sm text-smoke mt-2">{subtitle}</p>}
      </div>
      {actions && <div className="flex gap-2">{actions}</div>}
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
    "inline-flex items-center justify-center gap-2 rounded font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed";
  const sizes = { sm: "px-3 py-1.5 text-xs", md: "px-4 py-2.5 text-sm", lg: "px-6 py-3 text-sm" };
  const variants = {
    primary: "bg-graphite text-white hover:bg-terracotta",
    ghost: "border border-line text-graphite hover:bg-cream",
    danger: "bg-red-500 text-white hover:bg-red-600",
    quiet: "text-smoke hover:text-graphite",
  };
  return (
    <button type={type} className={`${base} ${sizes[size]} ${variants[variant]} ${className}`} {...rest}>
      {children}
    </button>
  );
}

export function Input({ label, error, hint, className = "", ...props }) {
  return (
    <label className={`block ${className}`}>
      {label && (
        <span className="block text-xs uppercase tracking-ultrawide text-smoke mb-2">
          {label}
        </span>
      )}
      <input
        {...props}
        className={`w-full bg-white border rounded px-3.5 py-2.5 text-sm text-graphite outline-none transition-colors ${
          error ? "border-red-400 focus:border-red-500" : "border-line focus:border-graphite"
        }`}
      />
      {hint && !error && <span className="block text-xs text-smoke mt-1.5">{hint}</span>}
      {error && <span className="block text-xs text-red-600 mt-1.5">{error}</span>}
    </label>
  );
}

export function Textarea({ label, error, rows = 4, className = "", ...props }) {
  return (
    <label className={`block ${className}`}>
      {label && (
        <span className="block text-xs uppercase tracking-ultrawide text-smoke mb-2">
          {label}
        </span>
      )}
      <textarea
        rows={rows}
        {...props}
        className={`w-full bg-white border rounded px-3.5 py-2.5 text-sm text-graphite outline-none transition-colors resize-y ${
          error ? "border-red-400 focus:border-red-500" : "border-line focus:border-graphite"
        }`}
      />
      {error && <span className="block text-xs text-red-600 mt-1.5">{error}</span>}
    </label>
  );
}

export function Select({ label, error, options = [], className = "", ...props }) {
  return (
    <label className={`block ${className}`}>
      {label && (
        <span className="block text-xs uppercase tracking-ultrawide text-smoke mb-2">
          {label}
        </span>
      )}
      <select
        {...props}
        className={`w-full bg-white border rounded px-3.5 py-2.5 text-sm text-graphite outline-none transition-colors cursor-pointer ${
          error ? "border-red-400 focus:border-red-500" : "border-line focus:border-graphite"
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
      {error && <span className="block text-xs text-red-600 mt-1.5">{error}</span>}
    </label>
  );
}

export function FormField({ label, hint, error, children, className = "" }) {
  return (
    <div className={`block ${className}`}>
      {label && (
        <span className="block text-xs uppercase tracking-ultrawide text-smoke mb-2">{label}</span>
      )}
      {children}
      {hint && !error && <span className="block text-xs text-smoke mt-1.5">{hint}</span>}
      {error && <span className="block text-xs text-red-600 mt-1.5">{error}</span>}
    </div>
  );
}

export function EmptyState({ title, message, action }) {
  return (
    <div className="text-center bg-white border border-dashed border-line rounded py-16 px-4">
      <div className="font-display text-2xl text-graphite">{title}</div>
      {message && <p className="text-sm text-smoke mt-2 max-w-md mx-auto">{message}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

export function StatusPill({ status }) {
  const map = {
    ongoing: "bg-amber-100 text-amber-800",
    ready: "bg-emerald-100 text-emerald-800",
    completed: "bg-graphite/10 text-graphite",
    upcoming: "bg-blue-100 text-blue-800",
    new: "bg-blue-100 text-blue-800",
    contacted: "bg-amber-100 text-amber-800",
    closed: "bg-graphite/10 text-graphite",
  };
  return (
    <span className={`inline-block px-2.5 py-1 text-[10px] uppercase tracking-widest rounded-full ${map[status] || "bg-cream text-smoke"}`}>
      {status}
    </span>
  );
}
