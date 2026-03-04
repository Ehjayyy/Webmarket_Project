import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../store/authStore";
import { useShop } from "../../store/shopStore";
import { useToast } from "../../store/toastStore";

export default function CreateShop() {
  const navigate = useNavigate();
  const { user, ready } = useAuth();
  const { myShop, createShop } = useShop();
  const { showToast } = useToast();

  const [shopName, setShopName] = useState("");
  const [description, setDescription] = useState("");


  // 🔹 Wait for auth to finish loading
  if (!ready) {
    return (
      <div className="mx-auto max-w-md px-4 py-10">
        <h1 className="text-xl font-semibold">Create Shop</h1>
        <p className="mt-2 text-gray-600">Loading account...</p>
      </div>
    );
  }

  // 🔹 Not logged in
  if (!user) {
    return (
      <div className="mx-auto max-w-md px-4 py-10">
        <h1 className="text-xl font-semibold">Create Shop</h1>
        <p className="mt-2 text-gray-600">You must be logged in.</p>
      </div>
    );
  }

  // 🔹 Only sellers allowed
  if (user.role !== "SELLER") {
    navigate("/");
    return null;
  }

  // 🔹 Already has shop
  if (myShop) {
    return (
      <div className="mx-auto max-w-md px-4 py-10">
        <h1 className="text-xl font-semibold">Create Shop</h1>
        <p className="mt-2 text-gray-600">
          You already have a shop:
          <span className="font-semibold ml-1">{myShop.shop_name}</span>
        </p>

        <button
          className="mt-4 rounded-xl border px-4 py-2 text-sm hover:bg-gray-50"
          onClick={() => navigate("/profile")}
        >
          Go to Profile
        </button>
      </div>
    );
  }

  // 🔹 Create shop form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await createShop({
        shop_name: shopName,
        description,
      });

      showToast("✅ Shop created successfully");
      navigate("/profile");
    } catch (err) {
      showToast(`❌ ${(err as Error).message ?? "Failed to create shop"}`);
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-10">
      <h1 className="text-xl font-semibold">Create Shop</h1>
      <p className="mt-1 text-sm text-gray-600">
        Set up your shop before posting products.
      </p>

      <form onSubmit={handleSubmit} className="mt-4 grid gap-3">
        <input
          type="text"
          required
          placeholder="Shop name"
          value={shopName}
          onChange={(e) => setShopName(e.target.value)}
          className="rounded-xl border px-3 py-2"
        />

        <textarea
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="rounded-xl border px-3 py-2 min-h-[120px]"
        />

        <button
          type="submit"
          className="rounded-xl border px-3 py-2 hover:bg-gray-50"
        >
          Create shop
        </button>
      </form>
    </div>
  );
}