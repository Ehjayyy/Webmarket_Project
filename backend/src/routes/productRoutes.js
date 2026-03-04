import express from "express";
import {
  createProduct,
  getProductsByShopId,
  getProductById,
  updateProduct,
  deleteProduct,
  getAllProducts,
} from "../controllers/productController.js";
import { auth, requireRole } from "../middleware/auth.js";

const router = express.Router();

router.post("/", auth, requireRole("SELLER"), createProduct);
router.get("/shop", auth, requireRole("SELLER"), getProductsByShopId);
router.get("/:id", getProductById);
router.put("/:id", auth, requireRole("SELLER"), updateProduct);
router.delete("/:id", auth, requireRole("SELLER"), deleteProduct);
router.get("/", getAllProducts);

export default router;
