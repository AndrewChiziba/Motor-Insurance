import { createContext, useState } from "react";
import type { ReactNode } from "react"; // Type-only import

interface AuthContextType {
  token: string | null;
  role: "Client" | "Admin" | null;
  login: (token: string, role: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
  const [role, setRole] = useState<"Client" | "Admin" | null>(
    token ? (localStorage.getItem("role") as "Client" | "Admin") : null
  );

  const login = (newToken: string, newRole: string) => {
    localStorage.setItem("token", newToken);
    localStorage.setItem("role", newRole);
    setToken(newToken);
    setRole(newRole as "Client" | "Admin");
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setToken(null);
    setRole(null);
  };

  return <AuthContext.Provider value={{ token, role, login, logout }}>{children}</AuthContext.Provider>;
};

// Remove the useAuth export from this file
export default AuthContext; // Optional: Export the context if needed elsewhere