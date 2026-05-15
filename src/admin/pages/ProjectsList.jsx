import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiPlus, FiEdit2, FiTrash2 } from "react-icons/fi";
import { projectsApi } from "../api/endpoints";
import {
  Card, PageHeader, Button, Select, EmptyState, StatusPill,
} from "../components/ui";
import { useToast } from "../components/Toast";

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
    if (!window.confirm(`Delete "${name}"? This will also remove its uploaded media.`)) return;
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
      <Card className="p-4 mb-6 flex flex-col sm:flex-row gap-3">
        <input
          type="search"
          placeholder="Search by name or location…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="flex-1 bg-white border border-line rounded px-3.5 py-2.5 text-sm outline-none focus:border-graphite"
        />
        <Select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          options={statusOptions}
          className="sm:w-56"
        />
      </Card>

      {loading ? (
        <div className="text-smoke text-sm">Loading projects…</div>
      ) : items.length === 0 ? (
        <EmptyState
          title="No projects yet"
          message="Add your first project to start populating the public site."
          action={
            <Link to="/admin/projects/new">
              <Button>Create your first project</Button>
            </Link>
          }
        />
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-cream/60 text-left text-xs uppercase tracking-widest text-smoke">
                  <th className="px-4 py-3">Project</th>
                  <th className="px-4 py-3">Location</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Updated</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((p) => (
                  <tr key={p._id} className="border-t border-line hover:bg-cream/30">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {p.featuredImage?.url ? (
                          <img
                            src={p.featuredImage.url}
                            alt=""
                            className="w-12 h-12 rounded object-cover bg-cream"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded bg-cream" />
                        )}
                        <div className="min-w-0">
                          <div className="font-medium text-graphite truncate">{p.name}</div>
                          <div className="text-[11px] text-smoke truncate">/{p.slug}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-smoke">{p.location}</td>
                    <td className="px-4 py-3">
                      <StatusPill status={p.status} />
                    </td>
                    <td className="px-4 py-3 text-xs text-smoke">
                      {new Date(p.updatedAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <Link to={`/admin/projects/${p._id}`}>
                        <Button variant="ghost" size="sm">
                          <FiEdit2 className="w-3.5 h-3.5" /> Edit
                        </Button>
                      </Link>
                      <button
                        onClick={() => onDelete(p._id, p.name)}
                        className="ml-2 text-red-500 hover:text-red-700 p-2"
                        aria-label="Delete"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </>
  );
}
