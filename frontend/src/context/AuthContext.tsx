import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User } from "../types";

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (userData: User, userToken: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    const storedToken = sessionStorage.getItem("token");

    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
      } catch (e) {
        console.error("Failed to parse stored user", e);
        sessionStorage.removeItem("user");
        sessionStorage.removeItem("token");
      }
    }
    setLoading(false);
  }, []);

  const login = (userData: User, userToken: string) => {
    setUser(userData);
    setToken(userToken);
    sessionStorage.setItem("user", JSON.stringify(userData));
    sessionStorage.setItem("token", userToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("token");
  };

  const value = React.useMemo(() => ({
    user,
    token,
    login,
    logout,
    isAuthenticated: !!token,
    loading
  }), [user, token, loading]); // login and logout are stable functions

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
