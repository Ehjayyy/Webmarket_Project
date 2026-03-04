import express from "express";
import {
  createOrder,
  getOrdersByUserId,
  getOrderById,
  updateOrderStatus,
  getOrdersByShopId,
} from "../controllers/orderController.js";
import { auth, requireRole } from "../middleware/auth.js";

const router = express.Router();

router.post("/", auth, requireRole("BUYER"), createOrder);
router.get("/", auth, getOrdersByUserId);
router.get("/:id", auth, getOrderById);
router.put("/:id/status", auth, updateOrderStatus);
router.get("/shop/orders", auth, requireRole("SELLER"), getOrdersByShopId);

export default router;
