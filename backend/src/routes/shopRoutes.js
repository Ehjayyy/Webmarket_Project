import express from "express";
import { createShop, getShopByUserId, getShopById, updateShop } from "../controllers/shopController.js";
import { auth, requireRole } from "../middleware/auth.js";

const router = express.Router();

router.post("/", auth, requireRole("SELLER"), createShop);
router.get("/me", auth, requireRole("SELLER"), getShopByUserId);
router.get("/:id", getShopById);
router.put("/", auth, requireRole("SELLER"), updateShop);

export default router;
