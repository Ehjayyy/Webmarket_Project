import express from "express";
import {
  getDashboardStats,
  getUsers,
  getShops,
  getProducts,
  getReports,
  getOrders,
  getCategories,
  deleteUser,
  deleteShop,
  deleteProduct,
  deleteReport,
  updateReportStatus,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/adminController.js";
import { auth, requireRole } from "../middleware/auth.js";

const router = express.Router();

// Dashboard stats
router.get("/dashboard/stats", auth, requireRole("ADMIN"), getDashboardStats);

// Users
router.get("/users", auth, requireRole("ADMIN"), getUsers);
router.delete("/users/:id", auth, requireRole("ADMIN"), deleteUser);

// Shops
router.get("/shops", auth, requireRole("ADMIN"), getShops);
router.delete("/shops/:id", auth, requireRole("ADMIN"), deleteShop);

// Products
router.get("/products", auth, requireRole("ADMIN"), getProducts);
router.delete("/products/:id", auth, requireRole("ADMIN"), deleteProduct);

// Reports
router.get("/reports", auth, requireRole("ADMIN"), getReports);
router.delete("/reports/:id", auth, requireRole("ADMIN"), deleteReport);
router.put("/reports/:id", auth, requireRole("ADMIN"), updateReportStatus);

// Orders
router.get("/orders", auth, requireRole("ADMIN"), getOrders);

// Categories
router.get("/categories", auth, requireRole("ADMIN"), getCategories);
router.post("/categories", auth, requireRole("ADMIN"), createCategory);
router.put("/categories/:id", auth, requireRole("ADMIN"), updateCategory);
router.delete("/categories/:id", auth, requireRole("ADMIN"), deleteCategory);

export default router;
