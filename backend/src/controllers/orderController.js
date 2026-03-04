import prisma from "../lib/prisma.js";

export async function createOrder(req, res) {
  try {
    const { items, total_amount } = req.body;

    if (!items || items.length === 0 || !total_amount) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Create order
    const order = await prisma.order.create({
      data: {
        user_id: req.user.id,
        total_amount: parseFloat(total_amount),
        status: "PENDING",
      },
    });

    // Create order items
    const orderItems = items.map((item) => ({
      order_id: order.id,
      product_id: parseInt(item.product_id),
      quantity: parseInt(item.quantity),
      price: parseFloat(item.price),
    }));

    await prisma.orderItem.createMany({
      data: orderItems,
    });

    // Reduce product stock
    for (const item of items) {
      await prisma.product.update({
        where: { id: parseInt(item.product_id) },
        data: {
          stock: {
            decrement: parseInt(item.quantity),
          },
        },
      });
    }

    const createdOrder = await prisma.order.findUnique({
      where: { id: order.id },
      include: {
        items: {
          include: { product: true },
        },
      },
    });

    res.json({
      ...createdOrder,
      total_amount: Number(createdOrder.total_amount),
      items: createdOrder.items.map(item => ({
        ...item,
        price: Number(item.price),
        product: {
          ...item.product,
          price: Number(item.product.price)
        }
      }))
    });
  } catch (e) {
    res.status(500).json({ message: "Server error", error: String(e) });
  }
}

export async function getOrdersByUserId(req, res) {
  try {
    const orders = await prisma.order.findMany({
      where: { user_id: req.user.id },
      include: {
        items: {
          include: { product: true },
        },
      },
      orderBy: { order_date: "desc" },
    });

    res.json(orders.map(order => ({
      ...order,
      total_amount: Number(order.total_amount),
      items: order.items.map(item => ({
        ...item,
        price: Number(item.price),
        product: {
          ...item.product,
          price: Number(item.product.price)
        }
      }))
    })));
  } catch (e) {
    res.status(500).json({ message: "Server error", error: String(e) });
  }
}

export async function getOrderById(req, res) {
  try {
    const { id } = req.params;
    const order = await prisma.order.findUnique({
      where: { id: parseInt(id) },
      include: {
        items: {
          include: { product: true },
        },
      },
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Check authorization
    if (req.user.role !== "ADMIN" && order.user_id !== req.user.id) {
      // Check if order contains products from user's shop (for seller)
      const orderItems = await prisma.orderItem.findMany({
        where: {
          order_id: parseInt(id),
          product: {
            shop: {
              user_id: req.user.id,
            },
          },
        },
      });

      if (req.user.role === "SELLER" && orderItems.length === 0) {
        return res.status(403).json({ message: "Forbidden" });
      }
    }

    res.json({
      ...order,
      total_amount: Number(order.total_amount),
      items: order.items.map(item => ({
        ...item,
        price: Number(item.price),
        product: {
          ...item.product,
          price: Number(item.product.price)
        }
      }))
    });
  } catch (e) {
    res.status(500).json({ message: "Server error", error: String(e) });
  }
}

export async function updateOrderStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const order = await prisma.order.findUnique({
      where: { id: parseInt(id) },
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const updatedOrder = await prisma.order.update({
      where: { id: parseInt(id) },
      data: { status },
    });

    res.json(updatedOrder);
  } catch (e) {
    res.status(500).json({ message: "Server error", error: String(e) });
  }
}

export async function getOrdersByShopId(req, res) {
  try {
    const shop = await prisma.shop.findFirst({
      where: { user_id: req.user.id },
    });

    if (!shop) {
      return res.status(400).json({ message: "Shop not found" });
    }

    // Get all orders that include products from this shop
    const orderItems = await prisma.orderItem.findMany({
      where: {
        product: {
          shop_id: shop.id,
        },
      },
      include: {
        order: {
          include: {
            user: true,
          },
        },
        product: true,
      },
    });

    // Group order items by order
    const ordersMap = new Map();
    orderItems.forEach((item) => {
      const orderId = item.order.id;
      if (!ordersMap.has(orderId)) {
        ordersMap.set(orderId, {
          ...item.order,
          items: [],
        });
      }
      ordersMap.get(orderId).items.push(item);
    });

    res.json(Array.from(ordersMap.values()).map(order => ({
      ...order,
      total_amount: Number(order.total_amount),
      items: order.items.map(item => ({
        ...item,
        price: Number(item.price),
        product: {
          ...item.product,
          price: Number(item.product.price)
        }
      }))
    })));
  } catch (e) {
    res.status(500).json({ message: "Server error", error: String(e) });
  }
}
