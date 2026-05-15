import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { authApi } from "../api/endpoints";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(() => {
    try {
      const raw = localStorage.getItem("nanma_admin");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(false);

  // Refresh /me on mount if we have a token (validates it)
  useEffect(() => {
    const token = localStorage.getItem("nanma_token");
    if (!token) return;
    authApi
      .me()
      .then(({ admin }) => {
        setAdmin(admin);
        localStorage.setItem("nanma_admin", JSON.stringify(admin));
      })
      .catch(() => {
        localStorage.removeItem("nanma_token");
        localStorage.removeItem("nanma_admin");
        setAdmin(null);
      });
  }, []);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    try {
      const { token, admin } = await authApi.login(email, password);
      localStorage.setItem("nanma_token", token);
      localStorage.setItem("nanma_admin", JSON.stringify(admin));
      setAdmin(admin);
      return admin;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("nanma_token");
    localStorage.removeItem("nanma_admin");
    setAdmin(null);
  }, []);

  return (
    <AuthContext.Provider value={{ admin, loading, login, logout, isAuthenticated: !!admin }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
