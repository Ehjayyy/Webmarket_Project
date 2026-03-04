import prisma from "../lib/prisma.js";

export async function createShop(req, res) {
  try {
    const { shop_name, description } = req.body;

    if (!shop_name) {
      return res.status(400).json({ message: "Shop name is required" });
    }

    // Check if user already has a shop
    const existingShop = await prisma.shop.findFirst({
      where: { user_id: req.user.id },
    });

    if (existingShop) {
      return res.status(409).json({ message: "User already has a shop" });
    }

    const shop = await prisma.shop.create({
      data: {
        user_id: req.user.id,
        shop_name,
        description,
      },
    });

    res.json(shop);
  } catch (e) {
    res.status(500).json({ message: "Server error", error: String(e) });
  }
}

export async function getShopByUserId(req, res) {
  try {
    const shop = await prisma.shop.findFirst({
      where: { user_id: req.user.id },
    });

    if (!shop) {
      return res.status(404).json({ message: "Shop not found" });
    }

    res.json(shop);
  } catch (e) {
    res.status(500).json({ message: "Server error", error: String(e) });
  }
}

export async function getShopById(req, res) {
  try {
    const { id } = req.params;
    const shop = await prisma.shop.findUnique({
      where: { id: parseInt(id) },
    });

    if (!shop) {
      return res.status(404).json({ message: "Shop not found" });
    }

    res.json(shop);
  } catch (e) {
    res.status(500).json({ message: "Server error", error: String(e) });
  }
}

export async function updateShop(req, res) {
  try {
    const { shop_name, description } = req.body;

    const shop = await prisma.shop.update({
      where: { user_id: req.user.id },
      data: {
        shop_name,
        description,
      },
    });

    res.json(shop);
  } catch (e) {
    res.status(500).json({ message: "Server error", error: String(e) });
  }
}
