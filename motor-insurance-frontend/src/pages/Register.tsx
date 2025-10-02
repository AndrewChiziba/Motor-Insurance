import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { registerUser } from "../services/api/auth";

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ 
    email: "", 
    password: "", 
    fullname: "" 
  });
  const [errors, setErrors] = useState<{ password?: string }>({});

  const validatePassword = (password: string): string | null => {
    if (password.length < 8) {
      return "Password must be at least 8 characters long";
    }
    if (!/\d/.test(password)) {
      return "Password must include at least one number";
    }
    if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
      return "Password must include at least one special character";
    }
    return null;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    // Validate password in real-time
    if (name === "password") {
      const error = validatePassword(value);
      setErrors(prev => ({
        ...prev,
        password: error || undefined
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Final validation before submission
    const passwordError = validatePassword(form.password);
    if (passwordError) {
      setErrors({ password: passwordError });
      toast.error("Please fix password requirements", {
        className: "toast-text",
        position: "top-center",
      });
      return;
    }

    try {
      await registerUser(form);
      toast.success("Registration successful! Please login.", {
        className: "toast-text",
        position: "top-center",
      });
      navigate("/login");
    } catch {
      toast.error("Registration failed. Please try again.", {
        className: "toast-text",
        position: "top-center",
      });
    }
  };

  const getPasswordStrength = (password: string): { strength: string; color: string } => {
    if (password.length === 0) return { strength: "", color: "gray" };
    
    const hasMinLength = password.length >= 8;
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password);
    
    const requirementsMet = [hasMinLength, hasNumber, hasSpecialChar].filter(Boolean).length;
    
    switch (requirementsMet) {
      case 3:
        return { strength: "Strong", color: "green" };
      case 2:
        return { strength: "Medium", color: "orange" };
      case 1:
        return { strength: "Weak", color: "red" };
      default:
        return { strength: "Very Weak", color: "red" };
    }
  };

  const passwordStrength = getPasswordStrength(form.password);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center mb-8 absolute top-8">
        <h1 className="text-3xl font-bold text-blue-600">MotorInsurance</h1>
        <p className="text-gray-600 mt-2">Your Journey, Our Protection</p>
      </div>
      
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md w-96 space-y-6 border border-gray-200"
      >
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Create Account</h1>
          <p className="text-gray-600 mt-2">Join thousands of protected drivers</p>
        </div>
        
        <div className="space-y-4">
          <input
            type="text"
            name="fullname"
            placeholder="Full Name"
            value={form.fullname}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={form.email}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
          
          <div className="space-y-2">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.password ? 'border-red-500' : 'border-gray-300'
              }`}
              required
            />
            
            {/* Password Strength Indicator */}
            {form.password && (
              <div className="flex items-center space-x-2">
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${
                      passwordStrength.color === 'green' ? 'bg-green-500' :
                      passwordStrength.color === 'orange' ? 'bg-orange-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${(form.password.length / 16) * 100}%` }}
                  />
                </div>
                <span className={`text-xs font-medium ${
                  passwordStrength.color === 'green' ? 'text-green-600' :
                  passwordStrength.color === 'orange' ? 'text-orange-600' : 'text-red-600'
                }`}>
                  {passwordStrength.strength}
                </span>
              </div>
            )}
            
            {/* Password Requirements */}
            <div className="text-xs text-gray-600 space-y-1">
              <p className={form.password.length >= 8 ? 'text-green-600' : ''}>
                ✓ At least 8 characters
              </p>
              <p className={/\d/.test(form.password) ? 'text-green-600' : ''}>
                ✓ At least one number
              </p>
              <p className={/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(form.password) ? 'text-green-600' : ''}>
                ✓ At least one special character
              </p>
            </div>
            
            {/* Error Message */}
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            )}
          </div>
        </div>
        
        <button
          type="submit"
          disabled={!!errors.password}
          className={`w-full py-3 rounded-lg transition-colors font-semibold ${
            errors.password 
              ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          Create Account
        </button>
        
        <div className="text-center pt-4 border-t border-gray-200">
          <p className="text-gray-600">
            Already have an account?{" "}
            <span
              onClick={() => navigate("/login")}
              className="text-blue-600 cursor-pointer hover:text-blue-700 font-semibold"
            >
              Sign In
            </span>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Register;