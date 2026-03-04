
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../store/authStore";
import { useToast } from "../../store/toastStore";
import { useOrders } from "../../store/orderStore";
import { useCart } from "../../store/cartStore";

export default function Cart() {
  const nav = useNavigate();
  const { user, ready } = useAuth();
  const { showToast } = useToast();
  const { createOrder } = useOrders();

  /**
   * IMPORTANT:
   * This assumes your cartStore exports:
   * - items: Array<{ product: { id,name,price }, qty:number }>
   * - subtotal: number
   * - setQty(productId:number, qty:number)
   * - removeItem(productId:number)
   * - clearCart()
   *
   * If your names differ, paste your cartStore.tsx and I’ll match it.
   */
  const { items, subtotal, setQty, removeFromCart, clearCart } = useCart();

  if (!ready) return <Shell title="Cart" subtitle="Loading..." />;

  return (
    <Shell title="Cart" subtitle="Review your cart and checkout.">
      {items.length === 0 ? (
        <div className="mt-6 rounded-2xl border bg-white p-5 text-sm text-gray-600">
          Your cart is empty.{" "}
          <Link className="underline underline-offset-4" to="/">
            Go shopping
          </Link>
        </div>
      ) : (
        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          {/* Items */}
          <div className="lg:col-span-2 rounded-2xl border bg-white divide-y">
            {items.map((it) => (
              <div key={it.product.id} className="p-4 flex items-start justify-between gap-4">
                <div>
                  <div className="font-semibold">{it.product.name}</div>
                  <div className="text-sm text-gray-600">
                    ₱{Number(it.product.price).toFixed(2)}
                  </div>

                  <div className="mt-3 flex items-center gap-2">
                    <span className="text-sm text-gray-600">Qty:</span>
                    <input
                      className="w-20 rounded-xl border px-2 py-1 text-sm"
                      type="number"
                      min={1}
                      value={it.qty}
                      onChange={(e) => {
                        const next = Math.max(1, Number(e.target.value));
                        setQty(it.product.id, next);
                      }}
                    />
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <div className="text-sm font-semibold">
                    ₱{(Number(it.product.price) * Number(it.qty)).toFixed(2)}
                  </div>

                  <button
                    className="rounded-xl border px-3 py-2 text-sm hover:bg-gray-50"
                    onClick={() => {
                      removeFromCart(it.product.id);
                      showToast("🗑 Removed from cart");
                    }}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="rounded-2xl border bg-white p-5 h-fit">
            <div className="font-semibold">Summary</div>

            <div className="mt-3 flex items-center justify-between text-sm">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-semibold">₱{Number(subtotal).toFixed(2)}</span>
            </div>

            <div className="mt-4 grid gap-2">
              <button
                className="rounded-xl border px-3 py-2 hover:bg-gray-50"
                onClick={() => {
                  clearCart();
                  showToast("🧹 Cart cleared");
                }}
              >
                Clear Cart
              </button>

              <button
                className="rounded-xl border px-3 py-2 hover:bg-gray-50"
                onClick={async () => {
                  try {
                    if (!user) throw new Error("Please login first.");
                    if (user.role !== "BUYER") throw new Error("Only buyers can checkout.");
                    if (items.length === 0) throw new Error("Cart is empty.");

                    await createOrder({
                      total_amount: Number(subtotal),
                       items: items.map((x) => ({
                        product_id: x.product.id,
                        quantity: x.qty,
                        price: Number(x.product.price),
                      })),
                    });

                    clearCart();
                    showToast("✅ Order placed successfully");
                    nav("/buyer/orders");
                  } catch (err) {
                    showToast(`❌ ${(err as Error).message ?? "Checkout failed"}`);
                  }
                }}
              >
                Checkout
              </button>

              {!user && (
                <Link className="text-sm underline underline-offset-4 mt-1" to="/login">
                  Login to checkout
                </Link>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="mt-5">
        <Link className="underline underline-offset-4 text-sm" to="/">
          Back to Marketplace
        </Link>
      </div>
    </Shell>
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