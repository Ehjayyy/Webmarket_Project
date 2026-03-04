import { useEffect } from "react";
import { useAdmin } from "../../store/adminStore";
import { useAuth } from "../../store/authStore";
import { useToast } from "../../store/toastStore";

export default function Shops() {
  const { user } = useAuth();
  const { shops, shopsLoading, fetchShops, deleteShop } = useAdmin();
  const { showToast } = useToast();

  useEffect(() => {
    fetchShops();
  }, [fetchShops]);

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

  const handleDeleteShop = async (shopId: number) => {
    if (window.confirm("Are you sure you want to delete this shop? This will also delete all products in the shop.")) {
      try {
        await deleteShop(shopId);
        showToast("Shop deleted successfully");
      } catch {
        showToast("Failed to delete shop");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Manage Shops</h1>
          <p className="mt-2 text-lg text-gray-600">View and manage all shops</p>
        </div>

        {shopsLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-gray-500">Loading shops...</div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Shop
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Owner
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Products
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created
                    </th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {shops.map((shop) => (
                    <tr key={shop.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{shop.shop_name}</div>
                        <div className="text-sm text-gray-500">
                          {shop.description || "No description available"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{shop.user.name}</div>
                        <div className="text-sm text-gray-500">{shop.user.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{shop.product_count} products</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(shop.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleDeleteShop(shop.id)}
                          className="text-red-600 hover:text-red-900 mr-3"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {!shopsLoading && shops.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🏪</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No shops found</h3>
            <p className="text-gray-500">There are no registered shops yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
