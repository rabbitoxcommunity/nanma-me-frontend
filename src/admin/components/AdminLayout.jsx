import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  FiHome, FiLayers, FiImage, FiInbox, FiLogOut,
  FiMenu, FiX, FiExternalLink,
} from "react-icons/fi";
import { useAuth } from "../context/AuthContext";

const NAV_GROUPS = [
  {
    label: "General",
    items: [
      { to: "/admin", end: true, label: "Dashboard", Icon: FiHome },
      { to: "/admin/projects", label: "Projects", Icon: FiLayers },
      { to: "/admin/gallery", label: "Gallery", Icon: FiImage },
    ],
  },
  {
    label: "Inbox",
    items: [
      { to: "/admin/enquiries", label: "Enquiries", Icon: FiInbox },
    ],
  },
];

export default function AdminLayout() {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/admin/login", { replace: true });
  };

  const initials = (admin?.name || "A")
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="min-h-screen bg-[#F5F5F7] flex text-graphite">
      {/* Mobile top bar */}
      <header className="lg:hidden fixed top-0 inset-x-0 flex items-center justify-between bg-white border-b border-[rgba(26,24,21,0.08)] px-4 py-3.5 z-40">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-terracotta flex items-center justify-center">
            <span className="font-display text-white text-xs font-bold leading-none">N</span>
          </div>
          <span className="font-display text-graphite text-base">Nanma</span>
        </div>
        <button
          onClick={() => setOpen(!open)}
          className="w-9 h-9 flex items-center justify-center text-smoke hover:text-graphite transition-colors"
          aria-label="Toggle menu"
        >
          {open ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
        </button>
      </header>

      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-40 h-screen w-60 bg-white border-r border-[rgba(26,24,21,0.07)] flex flex-col shrink-0 transform transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Brand */}
        <div className="hidden lg:flex items-center gap-3 px-5 py-5 border-b border-[rgba(26,24,21,0.07)]">
          <div className="w-8 h-8 rounded-xl bg-terracotta flex items-center justify-center shrink-0">
            <span className="font-display text-white text-sm font-bold leading-none">N</span>
          </div>
          <div>
            <div className="font-display text-graphite text-sm font-medium leading-none">Nanma Estates</div>
            <div className="text-[10px] text-smoke mt-0.5">Admin Panel</div>
          </div>
        </div>

        {/* Nav groups */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-5">
          {NAV_GROUPS.map((group) => (
            <div key={group.label}>
              <div className="px-3 mb-1.5">
                <span className="text-[10px] font-semibold uppercase tracking-ultrawide text-ash">
                  {group.label}
                </span>
              </div>
              <div className="space-y-0.5">
                {group.items.map(({ to, label, Icon, end }) => (
                  <NavLink
                    key={to}
                    to={to}
                    end={end}
                    onClick={() => setOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                        isActive
                          ? "bg-terracotta/10 text-terracotta"
                          : "text-smoke hover:text-graphite hover:bg-[rgba(26,24,21,0.04)]"
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-terracotta" : ""}`} />
                        {label}
                      </>
                    )}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-3 pb-5 pt-3 border-t border-[rgba(26,24,21,0.07)] space-y-0.5">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-smoke hover:text-graphite hover:bg-[rgba(26,24,21,0.04)] transition-all"
          >
            <FiExternalLink className="w-4 h-4 shrink-0" />
            View site
          </a>

          {/* User row */}
          <div className="flex items-center gap-3 px-3 py-2.5">
            <div className="w-7 h-7 rounded-full bg-terracotta flex items-center justify-center text-white text-[10px] font-bold shrink-0">
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-medium text-graphite truncate leading-none">{admin?.name}</div>
              <div className="text-[10px] text-ash truncate mt-0.5">{admin?.email}</div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-smoke hover:bg-red-50 hover:text-red-500 transition-all"
          >
            <FiLogOut className="w-4 h-4 shrink-0" />
            Sign out
          </button>
        </div>
      </aside>

      {/* Overlay */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="lg:hidden fixed inset-0 z-30 bg-graphite/30 backdrop-blur-sm"
        />
      )}

      {/* Main */}
      <main className="flex-1 min-w-0 pt-14 lg:pt-0 overflow-x-hidden">
        <div className="max-w-5xl mx-auto px-5 sm:px-8 lg:px-10 py-8 lg:py-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
