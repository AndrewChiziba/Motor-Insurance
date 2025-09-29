import { useNavigate } from "react-router-dom";

export function useAuth() {
  const navigate = useNavigate();

  const login = (token: string, role: string, email: string, fullname: string) => {
    localStorage.setItem("token", token);
    localStorage.setItem("role", role);
    localStorage.setItem("email", email);
    localStorage.setItem("fullname", fullname);

    if (role === "Admin") {
      navigate("/admin");
    } else {
      navigate("/search");
    }
  };

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return { login, logout };
}
