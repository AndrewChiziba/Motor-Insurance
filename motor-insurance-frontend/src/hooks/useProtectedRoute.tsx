import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "./useAuth";

export const useProtectedRoute = () => {
  const { token, role } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!token) {
      navigate("/login", { replace: true });
    } else if (token && !location.pathname.includes(role || "")) {
      navigate(role === "Client" ? "/client" : "/admin", { replace: true });
    }
  }, [token, role, navigate, location]);
};