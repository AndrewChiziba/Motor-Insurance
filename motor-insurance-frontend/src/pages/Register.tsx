import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { registerUser } from "../services/Auth/api";

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", fullname: "", password: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        email: form.email,
        fullname: form.fullname.replace(/\s+/g, "_"),
        password: form.password,
      };
      await registerUser(payload);

      toast.success("Account Successfully Created", {
        className: "toast-text",
        position: "top-center",
      });
      navigate("/login");
    } catch {
      toast.error("Registration failed", {
        className: "toast-text",
        position: "top-center",
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-md w-96 space-y-4"
      >
        <h1 className="text-xl font-semibold text-center text-blue-600">Register</h1>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded"
          required
        />
        <input
          type="text"
          name="fullname"
          placeholder="Full Name"
          value={form.fullname}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Register
        </button>
           <p
          onClick={() => navigate("/Login")}
          className="text-sm text-blue-600 cursor-pointer text-center"
        >
          Already have an account? Login
        </p>
      </form>
    </div>
  );
};

export default Register;
