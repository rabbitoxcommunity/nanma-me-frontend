import { useState } from "react";
import { useNavigate, useLocation, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiMail, FiLock, FiArrowRight } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState(null);
  const [busy, setBusy] = useState(false);

  if (isAuthenticated) return <Navigate to="/admin" replace />;

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr(null);
    setBusy(true);
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (ex) {
      setErr(ex.response?.data?.error || "Incorrect email or password.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#F5F5F7]">
      {/* Left decorative panel */}
      <div className="hidden lg:flex flex-col justify-between w-[42%] bg-white border-r border-[rgba(26,24,21,0.07)] p-12 relative overflow-hidden shrink-0">
        {/* Background shapes */}
        <div className="absolute top-0 right-0 w-72 h-72 rounded-full bg-terracotta/5 -translate-y-1/3 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-56 h-56 rounded-full bg-terracotta/5 translate-y-1/3 -translate-x-1/3" />

        {/* Brand */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-terracotta flex items-center justify-center">
            <span className="font-display text-white font-bold">N</span>
          </div>
          <span className="font-display text-graphite text-xl">Nanma Estates</span>
        </div>

        {/* Illustration area */}
        <div className="relative z-10 space-y-4">
          {/* Mini stat cards */}
          <div className="bg-[#F5F5F7] rounded-2xl p-5">
            <div className="text-xs font-semibold uppercase tracking-ultrawide text-smoke mb-1">Total Projects</div>
            <div className="font-display text-4xl text-graphite font-light">12</div>
            <div className="flex items-center gap-1.5 mt-3">
              <div className="flex-1 h-1.5 bg-white rounded-full overflow-hidden">
                <div className="h-full w-3/4 bg-terracotta rounded-full" />
              </div>
              <span className="text-[10px] text-smoke">75%</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-terracotta/8 rounded-2xl p-4">
              <div className="text-[10px] font-semibold uppercase tracking-ultrawide text-smoke mb-1">Gallery</div>
              <div className="font-display text-2xl text-graphite font-light">48</div>
            </div>
            <div className="bg-emerald-50 rounded-2xl p-4">
              <div className="text-[10px] font-semibold uppercase tracking-ultrawide text-smoke mb-1">Enquiries</div>
              <div className="font-display text-2xl text-graphite font-light">24</div>
            </div>
          </div>
        </div>

        <p className="relative z-10 text-xs text-ash">Nanma Estates Admin Panel</p>
      </div>

      {/* Right — form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-sm"
        >
          {/* Mobile brand */}
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div className="w-9 h-9 rounded-xl bg-terracotta flex items-center justify-center">
              <span className="font-display text-white font-bold">N</span>
            </div>
            <span className="font-display text-graphite text-xl">Nanma Estates</span>
          </div>

          <h1 className="font-display text-3xl text-graphite font-light mb-1">Welcome back</h1>
          <p className="text-sm text-smoke mb-8">Sign in to manage your portfolio.</p>

          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-ultrawide text-smoke mb-2">
                Email address
              </label>
              <div className="relative">
                <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ash pointer-events-none" />
                <input
                  type="email"
                  autoComplete="username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@nanmaestates.com"
                  required
                  className="w-full bg-white border border-[rgba(26,24,21,0.14)] rounded-xl pl-10 pr-4 py-3 text-sm text-graphite outline-none focus:border-terracotta/50 focus:ring-2 focus:ring-terracotta/10 placeholder:text-ash transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-ultrawide text-smoke mb-2">
                Password
              </label>
              <div className="relative">
                <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ash pointer-events-none" />
                <input
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-white border border-[rgba(26,24,21,0.14)] rounded-xl pl-10 pr-4 py-3 text-sm text-graphite outline-none focus:border-terracotta/50 focus:ring-2 focus:ring-terracotta/10 placeholder:text-ash transition-all"
                />
              </div>
            </div>

            {err && (
              <div className="flex items-start gap-2.5 bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-sm text-red-600">
                <span className="shrink-0 mt-0.5">⚠</span>
                {err}
              </div>
            )}

            <button
              type="submit"
              disabled={busy || loading}
              className="w-full flex items-center justify-center gap-2 bg-terracotta hover:bg-clay text-white text-sm font-semibold rounded-xl py-3 transition-all active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed mt-2 shadow-sm"
            >
              {busy || loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in…
                </>
              ) : (
                <>
                  Sign in <FiArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-xs text-ash mt-8">
            Nanma Estates · Admin Portal · {new Date().getFullYear()}
          </p>
        </motion.div>
      </div>
    </div>
  );
}
