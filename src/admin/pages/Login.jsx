import { useState } from "react";
import { useNavigate, useLocation, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { Button, Input } from "../components/ui";
import Logo from "../../components/ui/Logo";

export default function Login() {
  const { login, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState(null);

  if (isAuthenticated) return <Navigate to="/admin" replace />;

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr(null);
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (ex) {
      setErr(ex.response?.data?.error || "Login failed");
    }
  };

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center p-5">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8 text-graphite">
          <Logo variant="stacked" showTagline className="mx-auto" />
        </div>
        <form
          onSubmit={onSubmit}
          className="bg-white rounded shadow-sm border border-line p-8 space-y-5"
        >
          <header className="mb-2">
            <h1 className="font-display text-3xl text-graphite">Admin Sign in</h1>
            <p className="text-sm text-smoke mt-1.5">
              Manage projects, gallery and enquiries.
            </p>
          </header>

          <Input
            label="Email"
            type="email"
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@nanmaestates.com"
            required
          />
          <Input
            label="Password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />

          {err && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">
              {err}
            </div>
          )}

          <Button type="submit" disabled={loading} className="w-full" size="lg">
            {loading ? "Signing in…" : "Sign in →"}
          </Button>
        </form>
      </motion.div>
    </div>
  );
}
