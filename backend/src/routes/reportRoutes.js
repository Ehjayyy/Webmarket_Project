import express from "express";
import { createReport, getReportsByUserId, getAllReports } from "../controllers/reportController.js";
import { auth, requireRole } from "../middleware/auth.js";

const router = express.Router();

router.post("/", auth, createReport);
router.get("/me", auth, getReportsByUserId);
router.get("/", auth, requireRole("ADMIN"), getAllReports);

export default router;
