import { useEffect, useState } from "react";
import { useAdmin } from "../../store/adminStore";
import { useAuth } from "../../store/authStore";
import { useToast } from "../../store/toastStore";

export default function Categories() {
  const { user } = useAuth();
  const { categories, categoriesLoading, fetchCategories, createCategory, updateCategory, deleteCategory } = useAdmin();
  const { showToast } = useToast();

  const [newCategoryName, setNewCategoryName] = useState("");
  const [editingCategoryId, setEditingCategoryId] = useState<number | null>(null);
  const [editingCategoryName, setEditingCategoryName] = useState("");

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

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

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) {
      showToast("Category name is required");
      return;
    }

    try {
      await createCategory(newCategoryName.trim());
      setNewCategoryName("");
      showToast("Category created successfully");
    } catch {
      showToast("Failed to create category");
    }
  };

  const handleUpdateCategory = async (categoryId: number) => {
    if (!editingCategoryName.trim()) {
      showToast("Category name is required");
      return;
    }

    try {
      await updateCategory(categoryId, editingCategoryName.trim());
      setEditingCategoryId(null);
      setEditingCategoryName("");
      showToast("Category updated successfully");
    } catch {
      showToast("Failed to update category");
    }
  };

  const handleDeleteCategory = async (categoryId: number) => {
    if (window.confirm("Are you sure you want to delete this category? This will also remove it from all products.")) {
      try {
        await deleteCategory(categoryId);
        showToast("Category deleted successfully");
      } catch {
        showToast("Failed to delete category");
      }
    }
  };

  const startEditing = (category: { id: number; name: string }) => {
    setEditingCategoryId(category.id);
    setEditingCategoryName(category.name);
  };

  const cancelEditing = () => {
    setEditingCategoryId(null);
    setEditingCategoryName("");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Manage Categories</h1>
          <p className="mt-2 text-lg text-gray-600">Create, edit, and delete product categories</p>
        </div>

        {/* Create Category Form */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Create New Category</h2>
          <div className="flex gap-4">
            <input
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="Enter category name"
              className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleCreateCategory}
              disabled={!newCategoryName.trim()}
              className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Create Category
            </button>
          </div>
        </div>

        {/* Categories List */}
        {categoriesLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-gray-500">Loading categories...</div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {categories.map((category) => (
                    <tr key={category.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        {editingCategoryId === category.id ? (
                          <input
                            type="text"
                            value={editingCategoryName}
                            onChange={(e) => setEditingCategoryName(e.target.value)}
                            className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        ) : (
                          <div className="text-sm font-medium text-gray-900">{category.name}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        {editingCategoryId === category.id ? (
                          <>
                            <button
                              onClick={() => handleUpdateCategory(category.id)}
                              className="text-green-600 hover:text-green-900 mr-3"
                            >
                              Save
                            </button>
                            <button
                              onClick={cancelEditing}
                              className="text-gray-600 hover:text-gray-900 mr-3"
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => startEditing(category)}
                              className="text-blue-600 hover:text-blue-900 mr-3"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteCategory(category.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Delete
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {!categoriesLoading && categories.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🏷️</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No categories found</h3>
            <p className="text-gray-500">Create your first category above.</p>
          </div>
        )}
      </div>
    </div>
  );
}
