import { createContext, useContext, useEffect, useMemo, useState } from "react";
import api, { setAccessToken, setUnauthorizedHandler } from "../api/axios.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("user") || "null"));
  const [token, setToken] = useState(null);

  const saveSession = ({ access_token, refresh_token, user: nextUser }) => {
    setToken(access_token);
    setAccessToken(access_token);
    localStorage.setItem("refreshToken", refresh_token);
    localStorage.setItem("user", JSON.stringify(nextUser));
    setUser(nextUser);
  };

  const logout = () => {
    setToken(null);
    setAccessToken(null);
    setUser(null);
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  useEffect(() => setUnauthorizedHandler(logout), []);

  const login = async (username, password) => {
    const form = new URLSearchParams();
    form.append("username", username);
    form.append("password", password);
    const { data } = await api.post("/api/auth/login", form);
    saveSession(data);
  };

  const signup = async (payload) => {
    await api.post("/api/auth/signup", payload);
    await login(payload.email, payload.password);
  };

  const value = useMemo(() => ({ user, token, login, signup, logout, setToken }), [user, token]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
