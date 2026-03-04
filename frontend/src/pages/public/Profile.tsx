import { Link } from "react-router-dom";
import { useAuth } from "../../store/authStore";
import { useShop } from "../../store/shopStore";

export default function Profile() {
  const { user, ready } = useAuth();

  if (!ready) {
    return (
      <Shell title="Profile" subtitle="Loading..." />
    );
  }

  if (!user) {
    return (
      <Shell title="Profile" subtitle="You are not logged in.">
        <div className="mt-4 flex gap-3">
          <Link className="rounded-xl border px-4 py-2 text-sm hover:bg-gray-50" to="/login">
            Login
          </Link>
          <Link className="rounded-xl border px-4 py-2 text-sm hover:bg-gray-50" to="/register">
            Register
          </Link>
        </div>
      </Shell>
    );
  }

  return (
    <Shell title="Profile" subtitle={`Logged in as ${user.name} (${user.role})`}>
      <div className="mt-6 rounded-2xl border bg-white p-6">
        {user.role === "BUYER" && <BuyerProfile />}
        {user.role === "SELLER" && <SellerProfile />}
        {user.role === "ADMIN" && <AdminProfile />}
      </div>
    </Shell>
  );
}

/** ✅ Buyer dashboard */
function BuyerProfile() {
  return (
    <div>
      <h2 className="text-lg font-semibold">Buyer Dashboard</h2>
      <p className="mt-1 text-sm text-gray-600">
        View orders, track purchases, and manage reports.
      </p>

      <div className="mt-4 flex flex-wrap gap-3">
        <Link
          className="rounded-xl border px-4 py-2 text-sm hover:bg-gray-50"
          to="/buyer/orders"
        >
          My Orders
        </Link>

        <Link
          className="rounded-xl border px-4 py-2 text-sm hover:bg-gray-50"
          to="/cart"
        >
          View Cart
        </Link>

        <Link
          className="rounded-xl border px-4 py-2 text-sm hover:bg-gray-50"
          to="/buyer/report"
        >
          Report a Seller/Product
        </Link>
      </div>
    </div>
  );
}

/** ✅ Seller dashboard */
function SellerProfile() {
  const { myShop } = useShop();

  return (
    <div>
      <h2 className="text-lg font-semibold">Seller Dashboard</h2>
      <p className="mt-1 text-sm text-gray-600">
        Manage your shop, products, and customer orders.
      </p>

      {!myShop ? (
        <div className="mt-4">
          <p className="text-sm text-gray-600">
            You don’t have a shop yet. Create one first.
          </p>

          <div className="mt-3">
            <Link
              className="rounded-xl border px-4 py-2 text-sm hover:bg-gray-50"
              to="/seller/create-shop"
            >
              Create Shop
            </Link>
          </div>
        </div>
      ) : (
        <div className="mt-4">
          <div className="text-sm text-gray-700">
            Shop: <span className="font-semibold">{myShop.shop_name}</span>
          </div>

          <div className="mt-3 flex flex-wrap gap-3">
            <Link
              className="rounded-xl border px-4 py-2 text-sm hover:bg-gray-50"
              to="/seller/products"
            >
              Manage Products
            </Link>

            <Link
              className="rounded-xl border px-4 py-2 text-sm hover:bg-gray-50"
              to="/seller/orders"
            >
              Orders Received
            </Link>

            <Link
              className="rounded-xl border px-4 py-2 text-sm hover:bg-gray-50"
              to="/seller/shop"
            >
              Shop Profile
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

/** ✅ Admin dashboard */
function AdminProfile() {
  return (
    <div>
      <h2 className="text-lg font-semibold">Admin Dashboard</h2>
      <p className="mt-1 text-sm text-gray-600">
        Manage users, review reports, and moderate shops.
      </p>

      <div className="mt-4 flex flex-wrap gap-3">
        <Link
          className="rounded-xl border px-4 py-2 text-sm hover:bg-gray-50"
          to="/admin/dashboard"
        >
          Dashboard
        </Link>

        <Link
          className="rounded-xl border px-4 py-2 text-sm hover:bg-gray-50"
          to="/admin/users"
        >
          Manage Users
        </Link>

        <Link
          className="rounded-xl border px-4 py-2 text-sm hover:bg-gray-50"
          to="/admin/reports"
        >
          Review Reports
        </Link>

        <Link
          className="rounded-xl border px-4 py-2 text-sm hover:bg-gray-50"
          to="/admin/shops"
        >
          Manage Shops
        </Link>

        <Link
          className="rounded-xl border px-4 py-2 text-sm hover:bg-gray-50"
          to="/admin/products"
        >
          Manage Products
        </Link>

        <Link
          className="rounded-xl border px-4 py-2 text-sm hover:bg-gray-50"
          to="/admin/orders"
        >
          View Orders
        </Link>

        <Link
          className="rounded-xl border px-4 py-2 text-sm hover:bg-gray-50"
          to="/admin/categories"
        >
          Manage Categories
        </Link>
      </div>
    </div>
  );
}

function Shell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-2xl font-semibold">{title}</h1>
      <p className="mt-1 text-sm text-gray-600">{subtitle}</p>
      {children}
    </div>
  );
}