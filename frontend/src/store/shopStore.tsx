/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useAuth } from "./authStore";

export type Shop = {
  id: number;
  user_id: number;
  shop_name: string;
  description?: string | null;
  created_at: string;
};

type ShopContextValue = {
  myShop: Shop | null;
  createShop: (payload: { shop_name: string; description?: string }) => Promise<void>;
  updateShop: (payload: { shop_name: string; description?: string }) => Promise<void>;
  reloadMyShop: () => Promise<void>;
};

const ShopContext = createContext<ShopContextValue | null>(null);

export function ShopProvider({ children }: { children: React.ReactNode }) {
  const { user, token, ready } = useAuth();
  const [myShop, setMyShop] = useState<Shop | null>(null);

  const reloadMyShop = async () => {
    // If auth not ready yet or not logged in -> no shop
    if (!ready || !user || !token) {
      setMyShop(null);
      return;
    }

    try {
      const response = await fetch("http://localhost:4000/api/shops/me", {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setMyShop(data);
      } else {
        setMyShop(null);
      }
    } catch (error) {
      console.error("Failed to load shop:", error);
      setMyShop(null);
    }
  };

  // Keep myShop synced when auth changes
  useEffect(() => {
    if (user) {
      reloadMyShop();
    } else {
      setMyShop(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const createShop: ShopContextValue["createShop"] = async ({ shop_name, description }) => {
    if (!user || !token) {
      throw new Error("Not logged in.");
    }
    if (user.role !== "SELLER") {
      throw new Error("Only sellers can create shops.");
    }

    const response = await fetch("http://localhost:4000/api/shops", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({
        shop_name,
        description,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to create shop");
    }

    const data = await response.json();
    setMyShop(data);
  };

  const updateShop: ShopContextValue["updateShop"] = async ({ shop_name, description }) => {
    if (!ready || !user || !token) throw new Error("Not logged in.");
    const response = await fetch("http://localhost:4000/api/shops", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({
        shop_name,
        description,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to update shop");
    }

    const data = await response.json();
    setMyShop(data);
  };

  const value = useMemo(
    () => ({
      myShop,
      createShop,
      updateShop,
      reloadMyShop,
    }),
    [myShop]
  );

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

export function useShop() {
  const ctx = useContext(ShopContext);
  if (!ctx) throw new Error("useShop must be used within ShopProvider");
  return ctx;
}