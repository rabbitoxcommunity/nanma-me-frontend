import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  FiHome,
  FiLayers,
  FiImage,
  FiInbox,
  FiLogOut,
  FiMenu,
  FiX,
} from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import Logo from "../../components/ui/Logo";

const navItems = [
  { to: "/admin", end: true, label: "Dashboard", Icon: FiHome },
  { to: "/admin/projects", label: "Projects", Icon: FiLayers },
  { to: "/admin/gallery", label: "Gallery", Icon: FiImage },
  { to: "/admin/enquiries", label: "Enquiries", Icon: FiInbox },
];

export default function AdminLayout() {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/admin/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-cream text-graphite">
      {/* Mobile top bar */}
      <header className="lg:hidden flex items-center justify-between bg-white border-b border-line px-4 py-3 sticky top-0 z-30">
        <Logo />
        <button
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
          className="w-10 h-10 flex items-center justify-center"
        >
          {open ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
        </button>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`fixed lg:sticky top-0 left-0 z-40 h-screen w-72 bg-white border-r border-line flex flex-col transform transition-transform duration-300 ${
            open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          }`}
        >
          <div className="px-7 py-6 border-b border-line hidden lg:block">
            <Logo showTagline />
          </div>

          <div className="px-5 py-5 border-b border-line">
            <div className="text-xs uppercase tracking-ultrawide text-smoke mb-1">
              Signed in as
            </div>
            <div className="font-medium text-sm">{admin?.name}</div>
            <div className="text-xs text-smoke mt-0.5 truncate">{admin?.email}</div>
          </div>

          <nav className="flex-1 px-3 py-5 space-y-0.5">
            {navItems.map(({ to, label, Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `group flex items-center gap-3 px-4 py-3 rounded text-sm transition-colors ${
                    isActive
                      ? "bg-graphite text-white"
                      : "text-smoke hover:bg-cream hover:text-graphite"
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                {label}
              </NavLink>
            ))}
          </nav>

          <div className="px-3 py-4 border-t border-line">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded text-sm text-smoke hover:bg-red-50 hover:text-red-600 transition-colors"
            >
              <FiLogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </aside>

        {/* Backdrop */}
        {open && (
          <div
            onClick={() => setOpen(false)}
            className="lg:hidden fixed inset-0 z-30 bg-graphite/50"
          />
        )}

        {/* Main */}
        <main className="flex-1 min-w-0 lg:ml-0">
          <div className="max-w-6xl mx-auto px-5 sm:px-8 lg:px-10 py-8 lg:py-12">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
