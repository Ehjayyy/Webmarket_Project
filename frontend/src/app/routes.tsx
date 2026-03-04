import { createBrowserRouter } from "react-router-dom";
import PublicLayout from "./layouts/PublicLayout";

import Home from "../pages/public/Home";
import Login from "../pages/public/Login";
import Register from "../pages/public/Register";
import Cart from "../pages/public/Cart";
import Profile from "../pages/public/Profile";

import CreateShop from "../pages/seller/CreateShop";
import SellerProducts from "../pages/seller/SellerProducts";
import SellerOrders from "../pages/seller/SellerOrders";
import SellerShopProfile from "../pages/seller/SellerShopProfile";
import BuyerOrders from "../pages/buyer/BuyerOrders";
import BuyerReport from "../pages/buyer/BuyerReport";

import Dashboard from "../pages/admin/Dashboard";
import Users from "../pages/admin/Users";
import Shops from "../pages/admin/Shops";
import Products from "../pages/admin/Products";
import Reports from "../pages/admin/Reports";
import Orders from "../pages/admin/Orders";
import Categories from "../pages/admin/Categories";

export const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },
      { path: "/cart", element: <Cart /> },
      { path: "/profile", element: <Profile /> },

      // Seller routes
      { path: "/seller/create-shop", element: <CreateShop /> },
      { path: "/seller/products", element: <SellerProducts /> },
      { path: "/seller/orders", element: <SellerOrders /> },
      { path: "/seller/shop", element: <SellerShopProfile /> },
      
      // Buyer routes
      { path: "/buyer/orders", element: <BuyerOrders /> },
      { path: "/buyer/report", element: <BuyerReport /> },

      // Admin routes
      { path: "/admin/dashboard", element: <Dashboard /> },
      { path: "/admin/users", element: <Users /> },
      { path: "/admin/shops", element: <Shops /> },
      { path: "/admin/products", element: <Products /> },
      { path: "/admin/reports", element: <Reports /> },
      { path: "/admin/orders", element: <Orders /> },
      { path: "/admin/categories", element: <Categories /> },
    ],
    
  },
]);