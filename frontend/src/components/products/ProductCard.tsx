import type { Product } from "../../types/models";
import { useCart } from "../../store/cartStore";
import { useToast } from "../../store/toastStore";

export default function ProductCard({ p }: { p: Product }) {
  const outOfStock = p.stock <= 0;
  const { addToCart } = useCart();
  const { showToast } = useToast();

  return (
    <div className="rounded-2xl bg-white p-6 shadow-soft hover:shadow-medium transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 hover:border-primary-200 group">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="mb-2">
            <span className="inline-block px-3 py-1 bg-primary-100 text-primary-700 text-xs font-semibold rounded-full mb-3">
              {p.category?.name || 'Products'}
            </span>
            <h3 className="font-bold text-lg text-gray-900 leading-tight group-hover:text-primary-600 transition-colors">
              {p.name}
            </h3>
          </div>
          <p className="text-sm text-gray-600 line-clamp-2 mb-4">
            {p.description ?? "No description available."}
          </p>
        </div>

        <div className="text-right">
           <div className="font-bold text-xl bg-gradient-to-r from-primary-600 to-accent-500 bg-clip-text text-transparent">
             ₱{Number(p.price).toFixed(2)}
           </div>
          <div className="mt-1 text-xs text-gray-500">Stock: {p.stock}</div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between">
        {outOfStock ? (
          <span className="px-4 py-2 bg-gray-100 text-gray-600 text-sm font-medium rounded-full shadow-sm">
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              Out of Stock
            </span>
          </span>
        ) : (
          <span className="px-4 py-2 bg-success-100 text-success-700 text-sm font-medium rounded-full shadow-sm">
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Available
            </span>
          </span>
        )}

        <button
          className="px-6 py-3 bg-gradient-to-r from-primary-600 to-accent-500 text-white font-semibold rounded-xl shadow-soft hover:shadow-medium transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          disabled={outOfStock}
          onClick={() => {
            addToCart(p, 1);
            showToast(`✅ ${p.name} added to cart`);
          }}
        >
          <span className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add to Cart
          </span>
        </button>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="text-xs text-gray-500">
          Sold by <span className="font-semibold text-gray-700">{p.shop?.shop_name || 'Unknown Shop'}</span>
        </div>
      </div>
    </div>
  );
}