import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../store/authStore";
import { useOrders } from "../../store/orderStore";

export default function BuyerOrders() {
  const { user, ready } = useAuth();
  const { listMyOrders, loading } = useOrders();
  const [openOrderId, setOpenOrderId] = useState<number | null>(null);

  const orders = listMyOrders;

  if (!ready) return <Shell title="My Orders" subtitle="Loading..." />;
  if (!user) return <Shell title="My Orders" subtitle="Please login first." />;
  if (user.role !== "BUYER") return <Shell title="My Orders" subtitle="Only buyers can access this page." />;
  if (loading) return <Shell title="My Orders" subtitle="Loading orders..." />;

  return (
    <Shell title="My Orders" subtitle="Your recent orders are shown here.">
      {orders.length === 0 ? (
        <div className="mt-6 rounded-2xl border bg-white p-5 text-sm text-gray-600">
          No orders yet. Add items to cart and checkout.
        </div>
      ) : (
        <div className="mt-6 rounded-2xl border bg-white divide-y">
          {orders.map((o) => {
            const isOpen = openOrderId === o.id;

            return (
              <div key={o.id} className="p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="font-semibold">Order #{o.id}</div>
                    <div className="text-sm text-gray-600">
                       Status: {o.status} • Total: ₱{Number(o.total_amount).toFixed(2)}
                    </div>
                    <div className="text-xs text-gray-500">
                      Date: {new Date(o.order_date).toLocaleString()}
                    </div>
                  </div>

                  <button
                    className="rounded-xl border px-3 py-2 text-sm hover:bg-gray-50"
                    onClick={() => setOpenOrderId(isOpen ? null : o.id)}
                  >
                    {isOpen ? "Hide items" : "View items"}
                  </button>
                </div>

                {isOpen && (
                  <div className="mt-3 rounded-xl border bg-gray-50 p-3 text-sm">
                    {o.items && o.items.length === 0 ? (
                      <div className="text-gray-600">No items found.</div>
                    ) : (
                      <ul className="grid gap-2">
                        {o.items?.map((it) => (
                          <li key={it.id} className="flex items-center justify-between">
                            <div>
                              {it.product?.name || `Product #${it.product_id}`} × {it.quantity}
                            </div>
                            <div>₱{(Number(it.price) * Number(it.quantity)).toFixed(2)}</div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-4">
        <Link className="underline underline-offset-4 text-sm" to="/profile">
          Back to Profile
        </Link>
      </div>
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