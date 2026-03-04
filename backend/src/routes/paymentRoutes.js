import express from "express";
import { createPayment, getPaymentByOrderId } from "../controllers/paymentController.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

router.post("/", auth, createPayment);
router.get("/order/:orderId", auth, getPaymentByOrderId);

export default router;
