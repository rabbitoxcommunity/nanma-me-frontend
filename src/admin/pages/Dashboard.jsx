import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiLayers, FiImage, FiInbox } from "react-icons/fi";
import { statsApi } from "../api/endpoints";
import { Card, PageHeader, StatusPill } from "../components/ui";

const StatCard = ({ Icon, label, value, sublabel, to }) => {
  const Wrap = to ? Link : "div";
  return (
    <Wrap to={to} className={`block ${to ? "hover:-translate-y-0.5 transition-transform" : ""}`}>
      <Card className="p-6">
        <div className="flex items-start justify-between">
          <Icon className="w-6 h-6 text-terracotta" />
          {sublabel && <span className="text-xs text-smoke">{sublabel}</span>}
        </div>
        <div className="mt-6 font-display text-4xl font-light text-graphite leading-none">{value}</div>
        <div className="text-xs uppercase tracking-ultrawide text-smoke mt-2">{label}</div>
      </Card>
    </Wrap>
  );
};

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    statsApi
      .dashboard()
      .then(setData)
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-smoke">Loading…</div>;
  if (!data) return <div className="text-red-600">Failed to load stats.</div>;

  return (
    <>
      <PageHeader title="Dashboard" subtitle="Site activity at a glance." />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
        <StatCard
          Icon={FiLayers}
          label="Total Projects"
          value={data.projects.total}
          sublabel={`${data.projects.ongoing} ongoing · ${data.projects.upcoming} upcoming`}
          to="/admin/projects"
        />
        <StatCard
          Icon={FiImage}
          label="Gallery Items"
          value={data.gallery.total}
          to="/admin/gallery"
        />
        <StatCard
          Icon={FiInbox}
          label="Enquiries"
          value={data.enquiries.total}
          sublabel={`${data.enquiries.new} new`}
          to="/admin/enquiries"
        />
      </div>

      {/* Project breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="font-display text-xl text-graphite mb-5">Projects by status</h2>
          <ul className="space-y-3">
            {[
              ["ongoing", data.projects.ongoing, "Ongoing"],
              ["ready", data.projects.ready, "Ready to Move In"],
              ["completed", data.projects.completed, "Completed"],
              ["upcoming", data.projects.upcoming, "Upcoming"],
            ].map(([key, count, label]) => (
              <li key={key} className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-3">
                  <StatusPill status={key} />
                  <span>{label}</span>
                </span>
                <span className="font-display text-2xl text-graphite">{count}</span>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="p-6">
          <h2 className="font-display text-xl text-graphite mb-5">Recent enquiries</h2>
          {data.enquiries.recent.length === 0 ? (
            <p className="text-sm text-smoke">No enquiries yet.</p>
          ) : (
            <ul className="divide-y divide-line">
              {data.enquiries.recent.map((e) => (
                <li key={e._id} className="py-3 flex justify-between items-start gap-4">
                  <div className="min-w-0">
                    <div className="text-sm font-medium truncate">{e.name}</div>
                    <div className="text-xs text-smoke truncate">{e.email}</div>
                  </div>
                  <div className="text-right shrink-0">
                    <StatusPill status={e.status} />
                    <div className="text-[10px] text-smoke mt-1">
                      {new Date(e.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
          <div className="mt-5">
            <Link to="/admin/enquiries" className="text-xs text-terracotta uppercase tracking-widest underline-hover">
              View all →
            </Link>
          </div>
        </Card>
      </div>
    </>
  );
}
