import React from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ClientDashboard from "./pages/ClientDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import { useAuth } from "./hooks/useAuth";
// Remove direct use of useProtectedRoute here

// Create a ProtectedRoute component to handle routing logic
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { token, role } = useAuth(); // This is now inside a component
  const navigate = useNavigate();
  const location = useLocation();

  React.useEffect(() => {
    if (!token) {
      navigate("/login", { replace: true });
    } else if (token && !location.pathname.includes(role || "")) {
      navigate(role === "Client" ? "/client" : "/admin", { replace: true });
    }
  }, [token, role, navigate, location]);

  return <>{children}</>;
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/client"
            element={
              <ProtectedRoute>
                <ClientDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Login />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;