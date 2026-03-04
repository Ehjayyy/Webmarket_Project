import { useEffect } from "react";
import { useAdmin } from "../../store/adminStore";
import { useAuth } from "../../store/authStore";

export default function Dashboard() {
  const { user } = useAuth();
  const { stats, statsLoading, fetchStats } = useAdmin();

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  if (!user || user.role !== "ADMIN") {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">Access Denied</h1>
            <p className="mt-4 text-lg text-gray-600">You do not have permission to access this page.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="mt-2 text-lg text-gray-600">Manage your marketplace with ease</p>
        </div>

        {statsLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-gray-500">Loading dashboard data...</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                  <span className="text-white text-2xl">👥</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Users</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats?.users || 0}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                  <span className="text-white text-2xl">🏪</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Shops</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats?.shops || 0}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-yellow-500 rounded-md p-3">
                  <span className="text-white text-2xl">📦</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Products</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats?.products || 0}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-purple-500 rounded-md p-3">
                  <span className="text-white text-2xl">🛒</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Orders</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats?.orders || 0}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-red-500 rounded-md p-3">
                  <span className="text-white text-2xl">⚠️</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Reports</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats?.reports || 0}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-4">
              <button className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-md transition-colors">
                Manage Users
              </button>
              <button className="bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-4 rounded-md transition-colors">
                Review Reports
              </button>
              <button className="bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-3 px-4 rounded-md transition-colors">
                Manage Categories
              </button>
              <button className="bg-purple-500 hover:bg-purple-600 text-white font-medium py-3 px-4 rounded-md transition-colors">
                View Orders
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-green-100 rounded-full p-2">
                    <span className="text-green-600 text-sm">✅</span>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">New user registered</p>
                    <p className="text-xs text-gray-500">5 minutes ago</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-red-100 rounded-full p-2">
                    <span className="text-red-600 text-sm">⚠️</span>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">New report submitted</p>
                    <p className="text-xs text-gray-500">15 minutes ago</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-blue-100 rounded-full p-2">
                    <span className="text-blue-600 text-sm">📦</span>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">New product listed</p>
                    <p className="text-xs text-gray-500">30 minutes ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
