import { useState } from "react";
import { useNavigate, useLocation, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiMail, FiLock, FiArrowRight } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import Logo from "../../components/ui/Logo";

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
    <div className="admin-shell min-h-screen flex bg-[#F5F5F7]">
      {/* Left image panel */}
      <div className="hidden lg:flex flex-col justify-between w-[42%] relative overflow-hidden shrink-0">
        {/* Full-bleed background image */}
        <img
          src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1400&q=85"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          draggable={false}
        />
        {/* Gradient overlay — dark at top & bottom, lighter in middle */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-black/70" />

        {/* Brand */}
        <div className="relative z-10 p-8">
          <Logo showTagline markClass="h-32 w-auto" />
        </div>

        {/* Bottom quote */}
        <div className="relative z-10 p-10">
          <p className="text-white/90 text-lg font-medium leading-snug tracking-tight mb-3">
            "Crafting spaces that inspire<br />and endure."
          </p>
          <p className="text-white/50 text-xs">Nanma Properties · Admin Panel</p>
        </div>
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
          <div className="mb-8 lg:hidden text-smoke" style={{ filter: "grayscale(1)" }}>
            <Logo showTagline />
          </div>

          <h1 className="text-[28px] text-graphite font-semibold tracking-tight mb-1.5 leading-tight">Welcome back</h1>
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
                  placeholder="admin@nanmaconstruct.com"
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
            Nanma Properties · Admin Portal · {new Date().getFullYear()}
          </p>
        </motion.div>
      </div>
    </div>
  );
}
