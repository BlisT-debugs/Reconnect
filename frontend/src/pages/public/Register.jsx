import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import API from "../../services/api";

const Register = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [isSignUp, setIsSignUp] = useState(true); // Register default

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    tenantId: "admin",
  });

  const [message, setMessage] = useState("");

  const handleToggle = () => {
    navigate("/login"); // switch to login page
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await API.post("/auth/register", formData);
      localStorage.setItem("token", response.data.token);
      navigate("/dashboard");
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Registration failed"
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-white px-4">

      {/* CARD */}
      <div className="w-full max-w-md bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-gray-200 p-8">

        {/* 🔹 TOGGLE */}
        <div className="flex justify-center items-center gap-4 mb-8">
          
          <span className="text-gray-400">
            Login
          </span>

          <button
            onClick={handleToggle}
            className="w-14 h-7 flex items-center bg-gray-200 rounded-full p-1"
          >
            <div className="w-5 h-5 bg-emerald-600 rounded-full shadow-md translate-x-7 transition" />
          </button>

          <span className="font-semibold text-emerald-700">
            Register
          </span>

        </div>

        {/* TITLE */}
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Create Account
        </h2>

        {/* ERROR */}
        {message && (
          <p className="text-red-500 text-sm text-center mb-4">
            {message}
          </p>
        )}

        {/* FORM */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />

          <input
            type="email"
            name="email"
            placeholder="Official Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />

          <button
            type="submit"
            className="bg-emerald-700 text-white py-3 rounded-xl font-semibold hover:bg-emerald-800 transition"
          >
            Register
          </button>

        </form>

        {/* FOOTER */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{" "}
          <span
            onClick={handleToggle}
            className="text-emerald-700 cursor-pointer font-medium"
          >
            Login
          </span>
        </p>

      </div>
    </div>
  );
};

export default Register;