import prisma from "../lib/prisma.js";

export async function createProduct(req, res) {
  try {
    const { name, price, stock, description, category_id } = req.body;

    if (!name || !price || !stock || !category_id) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const shop = await prisma.shop.findFirst({
      where: { user_id: req.user.id },
    });

    if (!shop) {
      return res.status(400).json({ message: "Shop not found" });
    }

    const product = await prisma.product.create({
      data: {
        shop_id: shop.id,
        category_id: parseInt(category_id),
        name,
        price: parseFloat(price),
        stock: parseInt(stock),
        description,
      },
    });

    res.json({
      ...product,
      price: Number(product.price)
    });
  } catch (e) {
    res.status(500).json({ message: "Server error", error: String(e) });
  }
}

export async function getProductsByShopId(req, res) {
  try {
    const shop = await prisma.shop.findFirst({
      where: { user_id: req.user.id },
    });

    if (!shop) {
      return res.status(400).json({ message: "Shop not found" });
    }

    const products = await prisma.product.findMany({
      where: { shop_id: shop.id },
      include: { category: true },
    });

    res.json(products.map(product => ({
      ...product,
      price: Number(product.price)
    })));
  } catch (e) {
    res.status(500).json({ message: "Server error", error: String(e) });
  }
}

export async function getProductById(req, res) {
  try {
    const { id } = req.params;
    const product = await prisma.product.findUnique({
      where: { id: parseInt(id) },
      include: { shop: true, category: true },
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({
      ...product,
      price: Number(product.price)
    });
  } catch (e) {
    res.status(500).json({ message: "Server error", error: String(e) });
  }
}

export async function updateProduct(req, res) {
  try {
    const { id } = req.params;
    const { name, price, stock, description, category_id } = req.body;

    const product = await prisma.product.findUnique({
      where: { id: parseInt(id) },
      include: { shop: true },
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const shop = await prisma.shop.findFirst({
      where: { user_id: req.user.id },
    });

    if (product.shop_id !== shop.id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const updatedProduct = await prisma.product.update({
      where: { id: parseInt(id) },
      data: {
        name,
        price: price ? parseFloat(price) : undefined,
        stock: stock ? parseInt(stock) : undefined,
        description,
        category_id: category_id ? parseInt(category_id) : undefined,
      },
    });

    res.json({
      ...updatedProduct,
      price: Number(updatedProduct.price)
    });
  } catch (e) {
    res.status(500).json({ message: "Server error", error: String(e) });
  }
}

export async function deleteProduct(req, res) {
  try {
    const { id } = req.params;

    const product = await prisma.product.findUnique({
      where: { id: parseInt(id) },
      include: { shop: true },
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const shop = await prisma.shop.findFirst({
      where: { user_id: req.user.id },
    });

    if (product.shop_id !== shop.id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    await prisma.product.delete({
      where: { id: parseInt(id) },
    });

    res.json({ message: "Product deleted successfully" });
  } catch (e) {
    res.status(500).json({ message: "Server error", error: String(e) });
  }
}

export async function getAllProducts(req, res) {
  try {
    const { category_id, search } = req.query;
    const where = {};

    if (category_id) {
      where.category_id = parseInt(category_id);
    }

    if (search) {
      where.name = { contains: search, mode: "insensitive" };
    }

    const products = await prisma.product.findMany({
      where,
      include: { shop: true, category: true },
      orderBy: { created_at: "desc" },
    });

    res.json(products.map(product => ({
      ...product,
      price: Number(product.price)
    })));
  } catch (e) {
    res.status(500).json({ message: "Server error", error: String(e) });
  }
}
