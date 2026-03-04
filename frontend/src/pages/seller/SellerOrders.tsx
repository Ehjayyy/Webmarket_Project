import { Link } from "react-router-dom";
import { useAuth } from "../../store/authStore";

export default function SellerOrders() {
  const { user, ready } = useAuth();

  if (!ready) return <Shell title="Orders Received" subtitle="Loading..." />;
  if (!user) return <Shell title="Orders Received" subtitle="Please login first." />;
  if (user.role !== "SELLER") return <Shell title="Orders Received" subtitle="Only sellers can access this page." />;

  return (
    <Shell
      title="Orders Received"
      subtitle="For now this is a placeholder. Next we connect this to orders + order_items."
    >
      <div className="mt-6 rounded-2xl border bg-white p-5 text-sm text-gray-600">
        No orders yet (demo).
      </div>

      <Link to="/profile" className="inline-block mt-4 underline underline-offset-4 text-sm">
        Back to Profile
      </Link>
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