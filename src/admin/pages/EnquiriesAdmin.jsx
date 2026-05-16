import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiMail, FiPhone, FiTrash2, FiX, FiSearch, FiMessageCircle,
} from "react-icons/fi";
import { enquiriesApi } from "../api/endpoints";
import { PageHeader, Button, Select, EmptyState, StatusPill } from "../components/ui";
import { useToast } from "../components/Toast";
import { useConfirm } from "../components/ConfirmDialog";

const STATUSES = [
  { value: "all", label: "All" },
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "closed", label: "Closed" },
];

function Avatar({ name }) {
  const initials = (name || "?").split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();
  const hue = ((name || "").charCodeAt(0) * 43 + 20) % 360;
  return (
    <div
      className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0"
      style={{ backgroundColor: `hsl(${hue},50%,55%)` }}
    >
      {initials}
    </div>
  );
}

export default function EnquiriesAdmin() {
  const toast = useToast();
  const confirm = useConfirm();
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
    const ok = await confirm({
      title: `Delete enquiry from ${e.name}?`,
      message: "The full conversation will be removed permanently.",
      confirmLabel: "Delete enquiry",
      danger: true,
    });
    if (!ok) return;
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

      {/* Filters */}
      <div className="bg-white rounded-2xl px-4 py-3 mb-5 flex flex-col sm:flex-row gap-3 shadow-[0_1px_4px_rgba(26,24,21,0.06)]">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ash pointer-events-none" />
          <input
            type="search"
            placeholder="Search name, email or phone…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="w-full bg-[#F5F5F7] border-0 rounded-xl pl-10 pr-4 py-2.5 text-sm text-graphite outline-none focus:ring-2 focus:ring-terracotta/15 placeholder:text-ash transition-all"
          />
        </div>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="sm:w-44 bg-[#F5F5F7] border-0 rounded-xl px-3.5 py-2.5 text-sm text-graphite outline-none focus:ring-2 focus:ring-terracotta/15 cursor-pointer"
        >
          {STATUSES.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="bg-white rounded-2xl shadow-[0_1px_4px_rgba(26,24,21,0.06)] overflow-hidden animate-pulse">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-4 px-5 py-4 border-b border-[rgba(26,24,21,0.05)] last:border-0">
              <div className="w-8 h-8 rounded-full bg-[#F5F5F7] shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-3.5 w-36 bg-[#F5F5F7] rounded" />
                <div className="h-3 w-48 bg-[#F5F5F7] rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : items.length === 0 ? (
        <EmptyState
          title="No enquiries yet"
          message="Once someone submits the contact form, it will appear here."
        />
      ) : (
        <div className="bg-white rounded-2xl shadow-[0_1px_4px_rgba(26,24,21,0.06),0_4px_16px_rgba(26,24,21,0.04)] overflow-hidden">
          {/* Header */}
          <div className="grid grid-cols-[auto_1fr_auto_auto_auto] gap-4 items-center px-5 py-3 bg-[#F5F5F7] text-[10px] font-semibold uppercase tracking-ultrawide text-smoke border-b border-[rgba(26,24,21,0.06)]">
            <span className="w-8" />
            <span>Contact</span>
            <span className="hidden md:block w-24">Status</span>
            <span className="hidden lg:block w-28 text-right">Date</span>
            <span className="w-8" />
          </div>

          <ul className="divide-y divide-[rgba(26,24,21,0.05)]">
            {items.map((e) => (
              <li
                key={e._id}
                onClick={() => setActive(e)}
                className="grid grid-cols-[auto_1fr_auto_auto_auto] gap-4 items-center px-5 py-3.5 hover:bg-[rgba(26,24,21,0.02)] transition-colors cursor-pointer"
              >
                <Avatar name={e.name} />

                <div className="min-w-0">
                  <div className="font-medium text-sm text-graphite truncate">{e.name}</div>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="text-[11px] text-ash flex items-center gap-1 truncate">
                      <FiMail className="w-3 h-3 shrink-0" /> {e.email}
                    </span>
                  </div>
                </div>

                <div className="hidden md:block w-24">
                  <StatusPill status={e.status} />
                </div>

                <div className="hidden lg:block w-28 text-xs text-ash text-right whitespace-nowrap">
                  {new Date(e.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                </div>

                <button
                  onClick={(ev) => { ev.stopPropagation(); onDelete(e); }}
                  className="w-8 h-8 flex items-center justify-center rounded-lg text-smoke hover:text-red-500 hover:bg-red-50 transition-all"
                  aria-label="Delete"
                >
                  <FiTrash2 className="w-3.5 h-3.5" />
                </button>
              </li>
            ))}
          </ul>

          <div className="px-5 py-3 border-t border-[rgba(26,24,21,0.05)] bg-[#F5F5F7]/50">
            <span className="text-xs text-ash">{items.length} enquir{items.length !== 1 ? "ies" : "y"}</span>
          </div>
        </div>
      )}

      {/* Detail drawer */}
      <AnimatePresence>
        {active && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActive(null)}
              className="fixed inset-0 bg-graphite/20 backdrop-blur-sm z-40"
            />
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="fixed right-0 top-0 h-screen w-full max-w-md bg-white z-50 shadow-2xl overflow-y-auto"
            >
              {/* Drawer header */}
              <header className="flex items-center justify-between px-6 py-5 border-b border-[rgba(26,24,21,0.07)] sticky top-0 bg-white z-10">
                <div className="flex items-center gap-3">
                  <Avatar name={active.name} />
                  <div>
                    <div className="font-medium text-sm text-graphite">{active.name}</div>
                    <StatusPill status={active.status} />
                  </div>
                </div>
                <button
                  onClick={() => setActive(null)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg text-smoke hover:text-graphite hover:bg-[rgba(26,24,21,0.05)] transition-all"
                >
                  <FiX className="w-4 h-4" />
                </button>
              </header>

              <div className="p-6 space-y-6">
                {/* Contact info */}
                <div className="bg-[#F5F5F7] rounded-2xl p-4 space-y-3">
                  <a
                    href={`mailto:${active.email}`}
                    className="flex items-center gap-3 text-sm text-graphite hover:text-terracotta transition-colors"
                  >
                    <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center shadow-sm shrink-0">
                      <FiMail className="w-3.5 h-3.5 text-smoke" />
                    </div>
                    {active.email}
                  </a>
                  <a
                    href={`tel:${active.phone}`}
                    className="flex items-center gap-3 text-sm text-graphite hover:text-terracotta transition-colors"
                  >
                    <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center shadow-sm shrink-0">
                      <FiPhone className="w-3.5 h-3.5 text-smoke" />
                    </div>
                    {active.phone}
                  </a>
                </div>

                {/* Subject */}
                {active.subject && (
                  <div>
                    <div className="text-[10px] font-semibold uppercase tracking-ultrawide text-smoke mb-1.5">Subject</div>
                    <div className="text-sm text-graphite">{active.subject}</div>
                  </div>
                )}

                {/* Message */}
                <div>
                  <div className="text-[10px] font-semibold uppercase tracking-ultrawide text-smoke mb-2 flex items-center gap-1.5">
                    <FiMessageCircle className="w-3 h-3" /> Message
                  </div>
                  <p className="text-sm text-graphite whitespace-pre-wrap leading-relaxed bg-[#F5F5F7] rounded-2xl p-4">
                    {active.message}
                  </p>
                </div>

                {/* Project reference */}
                {active.projectName && (
                  <div className="text-xs text-smoke bg-terracotta/8 rounded-xl px-4 py-3">
                    Enquiry for: <span className="text-terracotta font-medium">{active.projectName}</span>
                  </div>
                )}

                {/* Status + notes */}
                <div className="space-y-4 pt-2 border-t border-[rgba(26,24,21,0.07)]">
                  <Select
                    label="Update Status"
                    value={active.status}
                    onChange={(e) => onUpdate(active._id, { status: e.target.value })}
                    options={[
                      { value: "new", label: "New" },
                      { value: "contacted", label: "Contacted" },
                      { value: "closed", label: "Closed" },
                    ]}
                  />
                  <div>
                    <span className="block text-[10px] font-semibold uppercase tracking-ultrawide text-smoke mb-2">
                      Internal notes
                    </span>
                    <textarea
                      rows={4}
                      defaultValue={active.notes || ""}
                      onBlur={(e) => onUpdate(active._id, { notes: e.target.value })}
                      placeholder="Notes for your team…"
                      className="w-full bg-[#F5F5F7] border-0 rounded-xl px-4 py-3 text-sm text-graphite outline-none focus:ring-2 focus:ring-terracotta/15 placeholder:text-ash resize-none transition-all"
                    />
                  </div>
                </div>

                <Button
                  variant="danger"
                  onClick={() => onDelete(active)}
                  className="w-full"
                >
                  <FiTrash2 className="w-4 h-4" /> Delete enquiry
                </Button>

                <p className="text-center text-[10px] text-ash">
                  Received {new Date(active.createdAt).toLocaleString("en-IN")}
                </p>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
