import type { Category, Product } from "../types/models";

export const categories: Category[] = [
  { id: 1, name: "Electronics" },
  { id: 2, name: "Clothing" },
  { id: 3, name: "Food" },
  { id: 4, name: "School" },
];

export const products: Product[] = [
  {
    id: 1,
    shop_id: 1,
    category_id: 1,
    name: "Wireless Earbuds",
    price: 799,
    stock: 25,
    description: "Bluetooth earbuds with charging case.",
  },
  {
    id: 2,
    shop_id: 1,
    category_id: 1,
    name: "USB-C Fast Charger",
    price: 299,
    stock: 40,
    description: "20W fast charging adapter.",
  },
  {
    id: 3,
    shop_id: 2,
    category_id: 2,
    name: "Plain White T-Shirt",
    price: 199,
    stock: 10,
    description: "Soft cotton, unisex.",
  },
  {
    id: 4,
    shop_id: 3,
    category_id: 3,
    name: "Milk Tea (1L)",
    price: 120,
    stock: 0,
    description: "Best served cold.",
  },
  {
    id: 5,
    shop_id: 4,
    category_id: 4,
    name: "Notebook Set (3pcs)",
    price: 150,
    stock: 18,
    description: "A5 size, ruled pages.",
  },
];