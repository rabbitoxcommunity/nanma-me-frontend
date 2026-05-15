import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiLayers, FiImage, FiInbox, FiArrowRight, FiPlus, FiTrendingUp } from "react-icons/fi";
import { statsApi } from "../api/endpoints";
import { StatusPill } from "../components/ui";
import { useAuth } from "../context/AuthContext";

const STATUS_ROWS = [
  { key: "ongoing",   label: "Ongoing",          bar: "bg-amber-400" },
  { key: "ready",     label: "Ready to Move In", bar: "bg-emerald-400" },
  { key: "completed", label: "Completed",         bar: "bg-ash" },
  { key: "upcoming",  label: "Upcoming",          bar: "bg-blue-400" },
];

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

function Avatar({ name, size = "md" }) {
  const initials = (name || "?")
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  const hue = ((name || "").charCodeAt(0) * 43 + 20) % 360;
  const sz = size === "sm" ? "w-8 h-8 text-[10px]" : "w-9 h-9 text-xs";
  return (
    <div
      className={`${sz} rounded-full flex items-center justify-center text-white font-bold shrink-0`}
      style={{ backgroundColor: `hsl(${hue},50%,55%)` }}
    >
      {initials}
    </div>
  );
}

function KpiCard({ Icon, label, value, sublabel, badge, to, accent }) {
  const Wrap = to ? Link : "div";
  const accents = {
    orange: { iconBg: "bg-terracotta/10", iconColor: "text-terracotta", badgeBg: "bg-terracotta/10 text-terracotta" },
    blue:   { iconBg: "bg-blue-50",       iconColor: "text-blue-500",   badgeBg: "bg-blue-50 text-blue-600" },
    green:  { iconBg: "bg-emerald-50",    iconColor: "text-emerald-500",badgeBg: "bg-emerald-50 text-emerald-600" },
  };
  const a = accents[accent] || accents.orange;

  return (
    <Wrap
      to={to}
      className="group bg-white rounded-2xl p-6 shadow-[0_1px_4px_rgba(26,24,21,0.06),0_4px_16px_rgba(26,24,21,0.04)] hover:shadow-[0_4px_20px_rgba(26,24,21,0.1)] hover:-translate-y-0.5 transition-all duration-200 block"
    >
      <div className="flex items-start justify-between mb-5">
        <div className={`w-11 h-11 rounded-2xl flex items-center justify-center ${a.iconBg}`}>
          <Icon className={`w-5 h-5 ${a.iconColor}`} />
        </div>
        {badge && (
          <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full ${a.badgeBg}`}>
            {badge}
          </span>
        )}
      </div>

      <div className="text-4xl font-semibold tracking-tight text-graphite leading-none tabular-nums">
        {value ?? "—"}
      </div>
      <div className="text-xs font-semibold uppercase tracking-ultrawide text-smoke mt-3">{label}</div>
      {sublabel && (
        <div className="flex items-center gap-1.5 mt-2">
          <FiTrendingUp className="w-3 h-3 text-ash" />
          <span className="text-[11px] text-ash">{sublabel}</span>
        </div>
      )}
    </Wrap>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="h-10 w-64 bg-white rounded-xl" />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[0, 1, 2].map((i) => <div key={i} className="h-44 bg-white rounded-2xl" />)}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 h-72 bg-white rounded-2xl" />
        <div className="lg:col-span-2 h-72 bg-white rounded-2xl" />
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { admin } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    statsApi.dashboard().then(setData).catch(() => setData(null)).finally(() => setLoading(false));
  }, []);

  const firstName = admin?.name?.split(" ")[0] || "there";

  if (loading) return <LoadingSkeleton />;

  if (!data) {
    return (
      <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
        <FiInbox className="w-10 h-10 text-ash mx-auto mb-4" />
        <p className="text-smoke text-sm">Could not load dashboard stats. Check the backend connection.</p>
      </div>
    );
  }

  const total = data.projects.total || 0;

  return (
    <div className="space-y-7">
      {/* Top header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-2xl px-6 py-5 shadow-[0_1px_4px_rgba(26,24,21,0.06),0_4px_16px_rgba(26,24,21,0.04)]">
        <div className="flex items-center gap-4">
          <Avatar name={admin?.name || "Admin"} />
          <div>
            <p className="text-xs text-smoke">
              {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}
            </p>
            <h1 className="text-xl text-graphite font-semibold tracking-tight mt-0.5">
              {greeting()}, <span className="text-terracotta">{firstName}</span>.
            </h1>
          </div>
        </div>
        <Link
          to="/admin/projects/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-terracotta hover:bg-clay text-white text-sm font-medium rounded-xl transition-colors shadow-sm shrink-0 active:scale-[0.98]"
        >
          <FiPlus className="w-4 h-4" />
          New Project
        </Link>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <KpiCard
          Icon={FiLayers}
          label="Total Projects"
          value={data.projects.total}
          sublabel={`${data.projects.ongoing} ongoing · ${data.projects.upcoming} upcoming`}
          to="/admin/projects"
          accent="orange"
        />
        <KpiCard
          Icon={FiImage}
          label="Gallery Items"
          value={data.gallery.total}
          to="/admin/gallery"
          accent="blue"
        />
        <KpiCard
          Icon={FiInbox}
          label="Enquiries"
          value={data.enquiries.total}
          badge={data.enquiries.new > 0 ? `${data.enquiries.new} new` : null}
          sublabel={data.enquiries.new > 0 ? "Needs attention" : "All up to date"}
          to="/admin/enquiries"
          accent="green"
        />
      </div>

      {/* Lower row */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Project status breakdown */}
        <div className="lg:col-span-3 bg-white rounded-2xl p-6 shadow-[0_1px_4px_rgba(26,24,21,0.06),0_4px_16px_rgba(26,24,21,0.04)]">
          <div className="flex items-center justify-between mb-7">
            <div>
              <h2 className="text-base font-semibold tracking-tight text-graphite">Projects overview</h2>
              <p className="text-xs text-smoke mt-0.5">{total} total projects across all categories</p>
            </div>
            <Link
              to="/admin/projects"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-terracotta hover:text-clay transition-colors"
            >
              Manage <FiArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {total === 0 ? (
            <div className="py-8 text-center text-sm text-smoke">
              No projects yet. <Link to="/admin/projects/new" className="text-terracotta underline">Create one →</Link>
            </div>
          ) : (
            <div className="space-y-5">
              {STATUS_ROWS.map(({ key, label, bar }) => {
                const count = data.projects[key] || 0;
                const pct = total > 0 ? Math.round((count / total) * 100) : 0;
                return (
                  <div key={key}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-graphite font-medium">{label}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-smoke">{pct}%</span>
                        <span className="text-xl font-semibold tracking-tight text-graphite leading-none tabular-nums w-6 text-right">{count}</span>
                      </div>
                    </div>
                    <div className="h-2 bg-[rgba(26,24,21,0.06)] rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${bar} transition-all duration-700`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Recent enquiries */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-[0_1px_4px_rgba(26,24,21,0.06),0_4px_16px_rgba(26,24,21,0.04)]">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-base font-semibold tracking-tight text-graphite">Enquiries</h2>
              <p className="text-xs text-smoke mt-0.5">Recent submissions</p>
            </div>
            <Link
              to="/admin/enquiries"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-terracotta hover:text-clay transition-colors"
            >
              All <FiArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {data.enquiries.recent.length === 0 ? (
            <div className="py-8 text-center">
              <FiInbox className="w-8 h-8 text-ash mx-auto mb-3" />
              <p className="text-sm text-smoke">No enquiries yet.</p>
            </div>
          ) : (
            <ul className="space-y-1">
              {data.enquiries.recent.map((e) => (
                <li key={e._id}>
                  <Link
                    to="/admin/enquiries"
                    className="flex items-center gap-3 py-2.5 px-1 rounded-xl hover:bg-[rgba(26,24,21,0.03)] transition-colors"
                  >
                    <Avatar name={e.name} size="sm" />
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium text-graphite truncate">{e.name}</div>
                      <div className="text-[11px] text-smoke truncate">{e.email}</div>
                    </div>
                    <div className="text-right shrink-0">
                      <StatusPill status={e.status} />
                      <div className="text-[10px] text-ash mt-1">
                        {new Date(e.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
