import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerApi } from "../services/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    // Replace spaces in fullName with underscores
    const formattedFullName = fullName.replace(/\s+/g, "_");

    try {
      const response = await registerApi({ email, password, fullName: formattedFullName });
      toast.success(response.message || "Registration successful!"); // Use the message from response
      setTimeout(() => navigate("/login"), 2000); // Redirect to login after 2 seconds
    } catch (error) {
      toast.error("Registration failed. Please try again.");
      console.error("Registration error:", error); // Debug the error
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-neutral">
      <div className="p-6 bg-white rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-semibold text-primary mb-4 text-center">Sign Up</h1>
        <form onSubmit={handleRegister} className="space-y-4">
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
          <input
            type="text"
            placeholder="Full Names"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
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