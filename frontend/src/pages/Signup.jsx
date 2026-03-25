
import { useNavigate } from "react-router-dom";
import { Mail, Lock, ArrowLeft, User } from "lucide-react";
import { useState } from "react";
import api from "../services/api";

const Signup = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("owner");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    // Basic validation
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    try {
      setLoading(true);

      await api.post("/users/register/", {
        username: email,   // Important for Django default User
        email: email,
        password: password,
        role: role,
        name: name,
      });

      navigate("/login");
    } catch (err) {
      if (err.response && err.response.data) {
        setError(
          err.response.data.detail ||
          "Registration failed. Please try again."
        );
      } else {
        setError("Registration failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white w-[400px] p-8 rounded-2xl shadow-lg">

        {/* Back Button */}
        <div
          className="flex items-center gap-2 text-gray-500 cursor-pointer mb-4"
          onClick={() => navigate("/login")}
        >
          <ArrowLeft size={16} />
          Back to sign in
        </div>

        <h1 className="text-2xl font-bold text-center mb-6">
          Create your account
        </h1>

        <form onSubmit={handleSignup} className="space-y-4">

          {/* Full Name */}
          <div className="relative">
            <User size={16} className="absolute top-3 left-3 text-gray-400" />
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full pl-10 pr-3 py-2 rounded-xl border bg-gray-50"
              required
            />
          </div>

          {/* Email */}
          <div className="relative">
            <Mail size={16} className="absolute top-3 left-3 text-gray-400" />
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-3 py-2 rounded-xl border bg-gray-50"
              required
            />
          </div>

          {/* Role */}
          <div className="relative">
            <User size={16} className="absolute top-3 left-3 text-gray-400" />
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full pl-10 pr-3 py-2 rounded-xl border bg-gray-50"
            >
              <option value="owner">Owner</option>
              <option value="vet">Vet</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {/* Password */}
          <div className="relative">
            <Lock size={16} className="absolute top-3 left-3 text-gray-400" />
            <input
              type="password"
              placeholder="Min. 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-3 py-2 rounded-xl border bg-gray-50"
              required
            />
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <Lock size={16} className="absolute top-3 left-3 text-gray-400" />
            <input
              type="password"
              placeholder="Re-enter password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full pl-10 pr-3 py-2 rounded-xl border bg-gray-50"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-900 text-white py-2 rounded-xl hover:bg-blue-800 transition disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create account"}
          </button>

          {/* Error */}
          {error && (
            <div className="text-red-500 text-sm text-center">
              {error}
            </div>
          )}
        </form>

      </div>
    </div>
  );
};

export default Signup;