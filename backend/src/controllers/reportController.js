import prisma from "../lib/prisma.js";

export async function createReport(req, res) {
  try {
    const { target_type, target_id, reason } = req.body;

    if (!target_type || !target_id || !reason) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const report = await prisma.report.create({
      data: {
        user_id: req.user.id,
        target_type,
        target_id: parseInt(target_id),
        reason,
      },
    });

    res.json(report);
  } catch (e) {
    res.status(500).json({ message: "Server error", error: String(e) });
  }
}

export async function getReportsByUserId(req, res) {
  try {
    const reports = await prisma.report.findMany({
      where: { user_id: req.user.id },
      orderBy: { created_at: "desc" },
    });

    res.json(reports);
  } catch (e) {
    res.status(500).json({ message: "Server error", error: String(e) });
  }
}

export async function getAllReports(req, res) {
  try {
    const reports = await prisma.report.findMany({
      include: { user: true },
      orderBy: { created_at: "desc" },
    });

    res.json(reports);
  } catch (e) {
    res.status(500).json({ message: "Server error", error: String(e) });
  }
}
