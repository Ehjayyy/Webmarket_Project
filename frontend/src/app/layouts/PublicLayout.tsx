import { Outlet, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../store/authStore";
import { useToast } from "../../store/toastStore";

export default function PublicLayout() {
  const nav = useNavigate();
  const { user, logout } = useAuth();
  const { showToast } = useToast();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <nav className="bg-white shadow-soft border-b border-gray-200">
        <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-accent-500 rounded-2xl flex items-center justify-center shadow-medium group-hover:shadow-strong transition-all duration-300 transform group-hover:scale-105">
              <span className="text-white font-bold text-lg">MP</span>
            </div>
            <span className="font-bold text-xl bg-gradient-to-r from-primary-700 to-accent-600 bg-clip-text text-transparent">
              MarketPlace
            </span>
          </Link>

          <div className="flex gap-4 items-center">
            {user && (
              <Link 
                to="/cart" 
                className="relative group px-3 py-2 rounded-xl hover:bg-primary-50 transition-all duration-300 transform hover:scale-105"
              >
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-gray-700 group-hover:text-primary-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span className="text-sm font-medium text-gray-700 group-hover:text-primary-600">Cart</span>
                </div>
              </Link>
            )}

            {!user ? (
              <>
                <Link 
                  to="/login" 
                  className="px-4 py-2 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-primary-50 hover:border-primary-300 hover:text-primary-600 transition-all duration-300 transform hover:scale-105"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-primary-600 to-accent-500 text-white font-medium shadow-soft hover:shadow-medium transition-all duration-300 transform hover:scale-105 hover:from-primary-700 hover:to-accent-600"
                >
                  Register
                </Link>
              </>
            ) : (
              <>
                <Link 
                  to="/profile" 
                  className="px-4 py-2 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-primary-50 hover:border-primary-300 hover:text-primary-600 transition-all duration-300 transform hover:scale-105"
                >
                  Profile
                </Link>
                <button
                  className="px-4 py-2 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-danger-50 hover:border-danger-300 hover:text-danger-600 transition-all duration-300 transform hover:scale-105"
                  onClick={() => {
                    logout();
                    showToast("✅ Logged out");
                    nav("/");
                  }}
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}