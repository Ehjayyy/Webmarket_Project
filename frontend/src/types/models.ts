export interface Category {
  id: number;
  name: string;
}

export interface Shop {
  id: number;
  user_id: number;
  shop_name: string;
  description?: string | null;
  created_at: string;
}

export interface Product {
  id: number;
  shop_id: number;
  category_id: number;
  name: string;
  price: number;
  stock: number;
  description?: string | null;
  category?: Category;
  shop?: Shop;
}