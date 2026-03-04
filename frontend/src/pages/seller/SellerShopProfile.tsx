import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../store/authStore";
import { useShop } from "../../store/shopStore";
import { useToast } from "../../store/toastStore";

export default function SellerShopProfile() {
  const nav = useNavigate();
  const { user, ready } = useAuth();
  const { myShop, updateShop } = useShop();
  const { showToast } = useToast();

  const [shopName, setShopName] = useState("");
  const [desc, setDesc] = useState("");

  useEffect(() => {
    if (myShop) {
      setShopName(myShop.shop_name);
      setDesc(myShop.description ?? "");
    }
  }, [myShop]);

  if (!ready) return <Shell title="Shop Profile" subtitle="Loading..." />;
  if (!user) return <Shell title="Shop Profile" subtitle="Please login first." />;
  if (user.role !== "SELLER") return <Shell title="Shop Profile" subtitle="Only sellers can access this page." />;
  if (!myShop) return <Shell title="Shop Profile" subtitle="No shop found. Create one first." />;

  return (
    <Shell title="Shop Profile" subtitle="Update your shop details.">
      <form
        className="mt-4 grid gap-3 max-w-lg"
        onSubmit={(e) => {
          e.preventDefault();
          try {
            updateShop({ shop_name: shopName, description: desc });
            showToast("✅ Shop updated");
            nav("/profile");
          } catch (err) {
            showToast(`❌ ${(err as Error).message ?? "Update failed"}`);
          }
        }}
      >
        <input
          className="rounded-xl border px-3 py-2"
          value={shopName}
          onChange={(e) => setShopName(e.target.value)}
          required
          placeholder="Shop name"
        />

        <textarea
          className="rounded-xl border px-3 py-2 min-h-[120px]"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          placeholder="Description"
        />

        <button className="rounded-xl border px-3 py-2 hover:bg-gray-50">
          Save changes
        </button>
      </form>
    </Shell>
  );
}

function Shell({ title, subtitle, children }: { title: string; subtitle: string; children?: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-2xl font-semibold">{title}</h1>
      <p className="mt-1 text-sm text-gray-600">{subtitle}</p>
      {children}
    </div>
  );
}