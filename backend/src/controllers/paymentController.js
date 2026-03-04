import prisma from "../lib/prisma.js";

export async function createPayment(req, res) {
  try {
    const { order_id, payment_method, payment_status } = req.body;

    if (!order_id || !payment_method || !payment_status) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const payment = await prisma.payment.create({
      data: {
        order_id: parseInt(order_id),
        payment_method,
        payment_status,
      },
    });

    // Update order status if payment is successful
    if (payment_status === "SUCCESS") {
      await prisma.order.update({
        where: { id: parseInt(order_id) },
        data: { status: "PAID" },
      });
    }

    res.json(payment);
  } catch (e) {
    res.status(500).json({ message: "Server error", error: String(e) });
  }
}

export async function getPaymentByOrderId(req, res) {
  try {
    const { orderId } = req.params;
    const payment = await prisma.payment.findUnique({
      where: { order_id: parseInt(orderId) },
    });

    res.json(payment);
  } catch (e) {
    res.status(500).json({ message: "Server error", error: String(e) });
  }
}
