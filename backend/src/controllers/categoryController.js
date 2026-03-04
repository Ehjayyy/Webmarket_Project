import prisma from "../lib/prisma.js";

export async function getAllCategories(req, res) {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: "asc" },
    });
    res.json(categories);
  } catch (e) {
    res.status(500).json({ message: "Server error", error: String(e) });
  }
}
