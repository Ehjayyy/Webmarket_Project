import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Role } from "../../store/authStore";
import { useAuth } from "../../store/authStore";
import { useToast } from "../../store/toastStore";

export default function Register() {
  const nav = useNavigate();
  const { register } = useAuth();
  const { showToast } = useToast();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("BUYER");
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await register({ name, email, password, role });
      showToast("✅ Account created and logged in");

      // ✅ Seller must create shop first
      if (role === "SELLER") {
        nav("/seller/create-shop");
      } else {
        nav("/");
      }
    } catch (err) {
      showToast(`❌ ${(err as Error).message ?? "Register failed"}`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-strong p-8 border border-gray-100">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-600 to-accent-500 rounded-2xl shadow-medium mb-4">
            <span className="text-white font-bold text-2xl">MP</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Create Account</h1>
          <p className="text-gray-600 mt-2">Join our marketplace community</p>
        </div>

        <form className="space-y-6" onSubmit={onSubmit}>
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Full Name
            </label>
            <div className="relative">
              <svg className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <input
                className="w-full pl-12 pr-4 py-3 rounded-2xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all duration-300"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Email Address
            </label>
            <div className="relative">
              <svg className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <input
                className="w-full pl-12 pr-4 py-3 rounded-2xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all duration-300"
                placeholder="Enter your email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Password
            </label>
            <div className="relative">
              <svg className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <input
                className="w-full pl-12 pr-4 py-3 rounded-2xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all duration-300"
                placeholder="Create a password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Account Type
            </label>
            <select
              className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all duration-300"
              value={role}
              onChange={(e) => setRole(e.target.value as Role)}
            >
              <option value="BUYER">Buyer - I want to purchase products</option>
              <option value="SELLER">Seller - I want to sell products</option>
              <option value="ADMIN">Admin - I want to manage the platform</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-gradient-to-r from-primary-600 to-accent-500 text-white font-bold rounded-2xl shadow-soft hover:shadow-medium transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
          >
            Create Account
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-gray-600 text-sm">
            Already have an account?{" "}
            <a href="/login" className="text-primary-600 font-semibold hover:text-primary-700 transition-colors">
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}