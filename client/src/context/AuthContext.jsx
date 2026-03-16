import { createContext, useEffect, useState } from "react";
import API from "../services/api";

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("currentUser");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  const login = async (credentials) => {
    const res = await API.login(credentials);
    if (res.success) setUser(res.user);
    return res;
  };

  const register = async (data) => {
    const res = await API.register(data);
    if (res.success) setUser(res.user);
    return res;
  };

  const logout = () => {
    localStorage.removeItem("currentUser");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
