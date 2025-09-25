import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signupApi } from "../services/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../hooks/useAuth";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"Client" | "Admin">("Client");
  const { login: setAuth } = useAuth();
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signupApi({ email, password, role });
      // Assuming signup returns a token; adjust based on backend response
      const { token } = await signupApi({ email, password, role }); // Note: Backend should return token on signup
      setAuth(token, role);
      toast.success("Signup successful! Redirecting...");
      setTimeout(() => navigate(role === "Client" ? "/client" : "/admin"), 2000);
    } catch {
      toast.error("Signup failed. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-neutral">
      <div className="p-6 bg-white rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-semibold text-primary mb-4 text-center">Sign Up</h1>
        <form onSubmit={handleSignup} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as "Client" | "Admin")}
            className="w-full p-2 border rounded"
          >
            <option value="Client">Client</option>
            <option value="Admin">Admin</option>
          </select>
          <button
            type="submit"
            className="w-full bg-primary text-white p-2 rounded hover:bg-opacity-90"
          >
            Sign Up
          </button>
        </form>
        <ToastContainer position="top-center" autoClose={3000} />
      </div>
    </div>
  );
};

export default Register;