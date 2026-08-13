import { createContext, useContext, useState } from "react";
import api from "../api/axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("pinzo_user");
    return stored ? JSON.parse(stored) : null;
  });

  const persist = (user, token) => {
    localStorage.setItem("pinzo_user", JSON.stringify(user));
    localStorage.setItem("pinzo_token", token);
    setUser(user);
  };

  const register = async (payload) => {
    const { data } = await api.post("/auth/register", payload);
    persist(data.user, data.token);
    return data.user;
  };

  const login = async (identifier, password) => {
    const { data } = await api.post("/auth/login", { identifier, password });
    persist(data.user, data.token);
    return data.user;
  };

  const updateProfile = async (payload) => {
    const { data } = await api.put("/auth/profile", payload);
    localStorage.setItem("pinzo_user", JSON.stringify(data));
    setUser(data);
    return data;
  };

  const logout = () => {
    localStorage.removeItem("pinzo_user");
    localStorage.removeItem("pinzo_token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, register, login, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
