import { useEffect, useState } from "react";
import { api, setToken } from "../api/client";
import { AuthContext } from "./authContext";

const hasStoredToken = () => Boolean(localStorage.getItem("ustaad_token"));

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(hasStoredToken);

  useEffect(() => {
    if (!hasStoredToken()) return;

    let cancelled = false;

    api.getMe()
      .then((data) => {
        if (!cancelled) setUser(data);
      })
      .catch(() => {
        if (!cancelled) {
          setUser(null);
          setToken(null);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const loginWithToken = async (token, userData) => {
    setToken(token);
    setUser(userData);
    setLoading(false);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
  };

  const refreshUser = async () => {
    try {
      const data = await api.getMe();
      setUser(data);
      return data;
    } catch {
      logout();
      return null;
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, loginWithToken, logout, refreshUser, setUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}
