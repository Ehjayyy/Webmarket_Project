/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useAuth } from "./authStore";
import { useShop } from "./shopStore";

export type Product = {
  id: number;
  shop_id: number;
  category_id: number;
  name: string;
  price: number;
  stock: number;
  description?: string | null;
  created_at: string;
  category?: { id: number; name: string };
  shop?: { id: number; shop_name: string };
};

type ProductCreatePayload = {
  category_id: number;
  name: string;
  price: number;
  stock: number;
  description?: string | null;
};

type ProductUpdatePayload = Partial<ProductCreatePayload>;

type ProductContextValue = {
  listByShop: Product[];
  loading: boolean;
  addProduct: (p: ProductCreatePayload) => Promise<void>;
  updateProduct: (id: number, patch: ProductUpdatePayload) => Promise<void>;
  deleteProduct: (id: number) => Promise<void>;
  reload: () => Promise<void>;
};

const ProductContext = createContext<ProductContextValue | null>(null);

export function ProductProvider({ children }: { children: React.ReactNode }) {
  const { user, token, ready } = useAuth();
  const { myShop } = useShop();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  const reload = useCallback(async () => {
    // If auth not ready yet or not logged in or no shop -> empty list
    if (!ready || !user || !token || !myShop) {
      setProducts([]);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("http://localhost:4000/api/products/shop", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        setProducts([]);
        return;
      }

      const data = (await response.json()) as Product[];
      setProducts(data);
    } catch (err) {
      console.error("Failed to load products:", err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [user, token, myShop]);

  useEffect(() => {
    // Reload whenever shop changes / user logs in/out
    reload();
  }, [reload]);

  const addProduct = useCallback<ProductContextValue["addProduct"]>(
    async (p) => {
      if (!user || !token) throw new Error("Not logged in");
      if (!myShop) throw new Error("No shop found");

      const response = await fetch("http://localhost:4000/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(p),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.message || "Failed to add product");
      }

      await reload();
    },
    [user, token, myShop, reload]
  );

  const updateProduct = useCallback<ProductContextValue["updateProduct"]>(
    async (id, patch) => {
      if (!user || !token) throw new Error("Not logged in");

      const response = await fetch(`http://localhost:4000/api/products/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(patch),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.message || "Failed to update product");
      }

      await reload();
    },
    [user, token, reload]
  );

  const deleteProduct = useCallback<ProductContextValue["deleteProduct"]>(
    async (id) => {
      if (!user || !token) throw new Error("Not logged in");

      const response = await fetch(`http://localhost:4000/api/products/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.message || "Failed to delete product");
      }

      await reload();
    },
    [user, token, reload]
  );

  const value = useMemo<ProductContextValue>(
    () => ({
      listByShop: products,
      loading,
      addProduct,
      updateProduct,
      deleteProduct,
      reload,
    }),
    [products, loading, addProduct, updateProduct, deleteProduct, reload]
  );

  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>;
}

export function useProducts() {
  const ctx = useContext(ProductContext);
  if (!ctx) throw new Error("useProducts must be used within ProductProvider");
  return ctx;
}