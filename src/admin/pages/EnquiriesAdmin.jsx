import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiMail, FiPhone, FiTrash2, FiX, FiInbox } from "react-icons/fi";
import { enquiriesApi } from "../api/endpoints";
import { Card, PageHeader, Button, Select, EmptyState, StatusPill } from "../components/ui";
import { useToast } from "../components/Toast";

const STATUSES = [
  { value: "all", label: "All" },
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "closed", label: "Closed" },
];

export default function EnquiriesAdmin() {
  const toast = useToast();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("all");
  const [q, setQ] = useState("");
  const [active, setActive] = useState(null);

  const load = () => {
    setLoading(true);
    enquiriesApi
      .list({ status, q })
      .then((d) => setItems(d.items))
      .catch(() => toast.error("Failed to load"))
      .finally(() => setLoading(false));
  };
  useEffect(load, [status, q]); // eslint-disable-line

  const onUpdate = async (id, patch) => {
    try {
      const updated = await enquiriesApi.update(id, patch);
      setItems((prev) => prev.map((e) => (e._id === id ? updated : e)));
      if (active?._id === id) setActive(updated);
      toast.success("Updated");
    } catch {
      toast.error("Update failed");
    }
  };

  const onDelete = async (e) => {
    if (!window.confirm(`Delete enquiry from ${e.name}?`)) return;
    try {
      await enquiriesApi.remove(e._id);
      setItems((prev) => prev.filter((x) => x._id !== e._id));
      setActive(null);
      toast.success("Deleted");
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <>
      <PageHeader
        title="Enquiries"
        subtitle="Manage incoming contact-form submissions."
      />

      <Card className="p-4 mb-6 flex flex-col sm:flex-row gap-3">
        <input
          type="search"
          placeholder="Search name, email or phone…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="flex-1 bg-white border border-line rounded px-3.5 py-2.5 text-sm outline-none focus:border-graphite"
        />
        <Select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          options={STATUSES}
          className="sm:w-48"
        />
      </Card>

      {loading ? (
        <div className="text-smoke text-sm">Loading…</div>
      ) : items.length === 0 ? (
        <EmptyState
          title="No enquiries"
          message="Once someone submits the contact form, you'll see it here."
        />
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-cream/60 text-left text-xs uppercase tracking-widest text-smoke">
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Contact</th>
                  <th className="px-4 py-3">Subject</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((e) => (
                  <tr
                    key={e._id}
                    className="border-t border-line hover:bg-cream/30 cursor-pointer"
                    onClick={() => setActive(e)}
                  >
                    <td className="px-4 py-3 font-medium">{e.name}</td>
                    <td className="px-4 py-3 text-smoke">
                      <div className="flex flex-col">
                        <span className="flex items-center gap-1.5"><FiMail className="w-3 h-3" /> {e.email}</span>
                        <span className="flex items-center gap-1.5"><FiPhone className="w-3 h-3" /> {e.phone}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-smoke max-w-xs truncate">{e.subject || "—"}</td>
                    <td className="px-4 py-3"><StatusPill status={e.status} /></td>
                    <td className="px-4 py-3 text-xs text-smoke whitespace-nowrap">
                      {new Date(e.createdAt).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={(ev) => { ev.stopPropagation(); onDelete(e); }}
                        className="text-red-500 hover:text-red-700 p-2"
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

      {/* Detail drawer */}
      <AnimatePresence>
        {active && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setActive(null)}
              className="fixed inset-0 bg-graphite/40 backdrop-blur-sm z-40"
            />
            <motion.aside
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="fixed right-0 top-0 h-screen w-full max-w-lg bg-white z-50 shadow-2xl overflow-y-auto"
            >
              <header className="flex items-center justify-between p-5 border-b border-line sticky top-0 bg-white z-10">
                <div className="flex items-center gap-3">
                  <FiInbox className="w-5 h-5 text-terracotta" />
                  <span className="font-display text-xl">Enquiry</span>
                </div>
                <button onClick={() => setActive(null)} className="text-smoke hover:text-graphite p-2"><FiX className="w-5 h-5" /></button>
              </header>
              <div className="p-6 space-y-5">
                <div>
                  <div className="text-xs uppercase tracking-ultrawide text-smoke">From</div>
                  <div className="font-display text-2xl text-graphite mt-1">{active.name}</div>
                </div>

                <div className="grid grid-cols-1 gap-3 text-sm">
                  <a href={`mailto:${active.email}`} className="flex items-center gap-3 text-graphite hover:text-terracotta">
                    <FiMail className="w-4 h-4" /> {active.email}
                  </a>
                  <a href={`tel:${active.phone}`} className="flex items-center gap-3 text-graphite hover:text-terracotta">
                    <FiPhone className="w-4 h-4" /> {active.phone}
                  </a>
                </div>

                {active.subject && (
                  <div>
                    <div className="text-xs uppercase tracking-ultrawide text-smoke mb-1">Subject</div>
                    <div className="text-sm">{active.subject}</div>
                  </div>
                )}

                <div>
                  <div className="text-xs uppercase tracking-ultrawide text-smoke mb-1">Message</div>
                  <p className="text-sm text-graphite whitespace-pre-wrap leading-relaxed bg-cream/60 p-4 rounded">
                    {active.message}
                  </p>
                </div>

                {active.projectName && (
                  <div className="text-xs text-smoke">
                    Submitted from project: <span className="text-graphite">{active.projectName}</span>
                  </div>
                )}

                <div className="flex flex-col gap-3 pt-3 border-t border-line">
                  <Select
                    label="Status"
                    value={active.status}
                    onChange={(e) => onUpdate(active._id, { status: e.target.value })}
                    options={[
                      { value: "new", label: "New" },
                      { value: "contacted", label: "Contacted" },
                      { value: "closed", label: "Closed" },
                    ]}
                  />
                  <div>
                    <span className="block text-xs uppercase tracking-ultrawide text-smoke mb-2">Internal notes</span>
                    <textarea
                      rows={4}
                      defaultValue={active.notes || ""}
                      onBlur={(e) => onUpdate(active._id, { notes: e.target.value })}
                      placeholder="Notes for your team…"
                      className="w-full bg-white border border-line rounded px-3.5 py-2.5 text-sm outline-none focus:border-graphite"
                    />
                  </div>
                </div>

                <Button variant="danger" onClick={() => onDelete(active)} className="w-full">
                  <FiTrash2 className="w-4 h-4" /> Delete enquiry
                </Button>

                <div className="text-xs text-smoke text-center">
                  Received {new Date(active.createdAt).toLocaleString()}
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
