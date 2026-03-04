import prisma from "../lib/prisma.js";

// Get dashboard statistics
export async function getDashboardStats(req, res) {
  try {
    const [userCount, shopCount, productCount, orderCount, reportCount] = await Promise.all([
      prisma.user.count(),
      prisma.shop.count(),
      prisma.product.count(),
      prisma.order.count(),
      prisma.report.count(),
    ]);

    res.json({
      users: userCount,
      shops: shopCount,
      products: productCount,
      orders: orderCount,
      reports: reportCount,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

// Get all users (admin only)
export async function getUsers(req, res) {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        created_at: true,
        shops: {
          select: {
            id: true,
            shop_name: true,
          },
        },
      },
    });

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

// Get all shops (admin only)
export async function getShops(req, res) {
  try {
    const shops = await prisma.shop.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        products: {
          select: {
            id: true,
          },
        },
      },
    });

    const shopsWithProductCount = shops.map((shop) => ({
      ...shop,
      product_count: shop.products.length,
    }));

    res.json(shopsWithProductCount);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

// Get all products (admin only)
export async function getProducts(req, res) {
  try {
    const products = await prisma.product.findMany({
      include: {
        shop: {
          select: {
            id: true,
            shop_name: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    res.json(products.map(product => ({
      ...product,
      price: Number(product.price)
    })));
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

// Get all reports (admin only)
export async function getReports(req, res) {
  try {
    const reports = await prisma.report.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

// Get all orders (admin only)
export async function getOrders(req, res) {
  try {
    const orders = await prisma.order.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        items: {
          select: {
            id: true,
            product_id: true,
            quantity: true,
            price: true,
          },
        },
        payment: true,
      },
    });

    res.json(orders.map(order => ({
      ...order,
      total_amount: Number(order.total_amount),
      items: order.items.map(item => ({
        ...item,
        price: Number(item.price)
      }))
    })));
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

// Get all categories (admin only)
export async function getCategories(req, res) {
  try {
    const categories = await prisma.category.findMany();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

// Delete user (admin only)
export async function deleteUser(req, res) {
  try {
    const { id } = req.params;
    await prisma.user.delete({
      where: { id: parseInt(id) },
    });
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

// Delete shop (admin only)
export async function deleteShop(req, res) {
  try {
    const { id } = req.params;
    await prisma.shop.delete({
      where: { id: parseInt(id) },
    });
    res.json({ message: "Shop deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

// Delete product (admin only)
export async function deleteProduct(req, res) {
  try {
    const { id } = req.params;
    await prisma.product.delete({
      where: { id: parseInt(id) },
    });
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

// Delete report (admin only)
export async function deleteReport(req, res) {
  try {
    const { id } = req.params;
    await prisma.report.delete({
      where: { id: parseInt(id) },
    });
    res.json({ message: "Report deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

// Update report status (admin only)
export async function updateReportStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const report = await prisma.report.update({
      where: { id: parseInt(id) },
      data: { status },
    });
    res.json(report);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

// Create category (admin only)
export async function createCategory(req, res) {
  try {
    const { name } = req.body;
    const category = await prisma.category.create({
      data: { name },
    });
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

// Update category (admin only)
export async function updateCategory(req, res) {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const category = await prisma.category.update({
      where: { id: parseInt(id) },
      data: { name },
    });
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

// Delete category (admin only)
export async function deleteCategory(req, res) {
  try {
    const { id } = req.params;
    await prisma.category.delete({
      where: { id: parseInt(id) },
    });
    res.json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
}
