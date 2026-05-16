import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiLayers } from "react-icons/fi";
import { projectsApi } from "../api/endpoints";
import { PageHeader, Button, EmptyState, StatusPill } from "../components/ui";
import { useToast } from "../components/Toast";
import { useConfirm } from "../components/ConfirmDialog";

const statusOptions = [
  { value: "all", label: "All Statuses" },
  { value: "ongoing", label: "Ongoing" },
  { value: "ready", label: "Ready to Move In" },
  { value: "completed", label: "Completed" },
  { value: "upcoming", label: "Upcoming" },
];

export default function ProjectsList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("all");
  const [q, setQ] = useState("");
  const toast = useToast();
  const confirm = useConfirm();

  const load = () => {
    setLoading(true);
    projectsApi
      .list({ status, q, limit: 100 })
      .then((d) => setItems(d.items))
      .catch(() => toast.error("Failed to load projects"))
      .finally(() => setLoading(false));
  };
  useEffect(load, [status, q]); // eslint-disable-line

  const onDelete = async (id, name) => {
    const ok = await confirm({
      title: `Delete "${name}"?`,
      message: "This will permanently remove the project and all its uploaded media. This action cannot be undone.",
      confirmLabel: "Delete project",
      danger: true,
    });
    if (!ok) return;
    try {
      await projectsApi.remove(id);
      setItems((prev) => prev.filter((p) => p._id !== id));
      toast.success("Project deleted");
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <>
      <PageHeader
        title="Projects"
        subtitle="Add, edit, and manage your residential projects."
        actions={
          <Link to="/admin/projects/new">
            <Button>
              <FiPlus className="w-4 h-4" /> New Project
            </Button>
          </Link>
        }
      />

      {/* Filters */}
      <div className="bg-white rounded-2xl px-4 py-3 mb-5 flex flex-col sm:flex-row gap-3 shadow-[0_1px_4px_rgba(26,24,21,0.06)]">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ash pointer-events-none" />
          <input
            type="search"
            placeholder="Search by name or location…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="w-full bg-[#F5F5F7] border-0 rounded-xl pl-10 pr-4 py-2.5 text-sm text-graphite outline-none focus:ring-2 focus:ring-terracotta/15 placeholder:text-ash transition-all"
          />
        </div>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="sm:w-52 bg-[#F5F5F7] border-0 rounded-xl px-3.5 py-2.5 text-sm text-graphite outline-none focus:ring-2 focus:ring-terracotta/15 cursor-pointer"
        >
          {statusOptions.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="bg-white rounded-2xl shadow-[0_1px_4px_rgba(26,24,21,0.06)] overflow-hidden animate-pulse">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-4 px-5 py-4 border-b border-[rgba(26,24,21,0.05)] last:border-0">
              <div className="w-12 h-12 rounded-xl bg-[#F5F5F7] shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-3.5 w-40 bg-[#F5F5F7] rounded" />
                <div className="h-3 w-24 bg-[#F5F5F7] rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : items.length === 0 ? (
        <EmptyState
          title="No projects yet"
          message="Add your first project to start populating the public site."
          action={
            <Link to="/admin/projects/new">
              <Button>
                <FiPlus className="w-4 h-4" /> Create your first project
              </Button>
            </Link>
          }
        />
      ) : (
        <div className="bg-white rounded-2xl shadow-[0_1px_4px_rgba(26,24,21,0.06),0_4px_16px_rgba(26,24,21,0.04)] overflow-hidden">
          {/* Table header */}
          <div className="grid grid-cols-[auto_1fr_auto_auto_auto] gap-4 items-center px-5 py-3 bg-[#F5F5F7] text-[10px] font-semibold uppercase tracking-ultrawide text-smoke border-b border-[rgba(26,24,21,0.06)]">
            <span className="w-12" />
            <span>Project</span>
            <span className="hidden md:block w-28">Status</span>
            <span className="hidden lg:block w-24">Updated</span>
            <span className="text-right w-20">Actions</span>
          </div>

          <ul className="divide-y divide-[rgba(26,24,21,0.05)]">
            {items.map((p) => (
              <li
                key={p._id}
                className="grid grid-cols-[auto_1fr_auto_auto_auto] gap-4 items-center px-5 py-3.5 hover:bg-[rgba(26,24,21,0.02)] transition-colors group"
              >
                {/* Thumbnail */}
                <div className="w-12 h-12 rounded-xl overflow-hidden bg-[#F5F5F7] shrink-0">
                  {p.featuredImage?.url ? (
                    <img src={p.featuredImage.url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FiLayers className="w-5 h-5 text-ash" />
                    </div>
                  )}
                </div>

                {/* Name + slug */}
                <div className="min-w-0">
                  <div className="font-medium text-sm text-graphite truncate">{p.name}</div>
                  <div className="text-[11px] text-ash truncate mt-0.5">{p.location} · /{p.slug}</div>
                </div>

                {/* Status */}
                <div className="hidden md:block w-28">
                  <StatusPill status={p.status} />
                </div>

                {/* Date */}
                <div className="hidden lg:block w-24 text-xs text-ash whitespace-nowrap">
                  {new Date(p.updatedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 w-20 justify-end">
                  <Link to={`/admin/projects/${p._id}`}>
                    <button className="w-8 h-8 flex items-center justify-center rounded-lg text-smoke hover:text-terracotta hover:bg-terracotta/8 transition-all">
                      <FiEdit2 className="w-3.5 h-3.5" />
                    </button>
                  </Link>
                  <button
                    onClick={() => onDelete(p._id, p.name)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg text-smoke hover:text-red-500 hover:bg-red-50 transition-all"
                    aria-label="Delete"
                  >
                    <FiTrash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <div className="px-5 py-3 border-t border-[rgba(26,24,21,0.05)] bg-[#F5F5F7]/50">
            <span className="text-xs text-ash">{items.length} project{items.length !== 1 ? "s" : ""}</span>
          </div>
        </div>
      )}
    </>
  );
}
