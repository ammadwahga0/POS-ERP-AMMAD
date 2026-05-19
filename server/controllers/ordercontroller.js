const prisma = require("../config/prisma");

// ==========================
// CREATE ORDER
// ==========================
const createOrder = async (req, res) => {
  try {
    const { cart, total, customerId } = req.body;

    // 1. CREATE ORDER
    const order = await prisma.order.create({
      data: {
        total: Number(total),
        customerId: customerId ? Number(customerId) : null,

        items: {
          create: cart.map((item) => ({
            productId: Number(item.id),
            quantity: Number(item.qty),
            price: Number(item.price),
          })),
        },
      },
    });

    // 2. REDUCE STOCK
    for (const item of cart) {
      const product = await prisma.product.findUnique({
        where: { id: Number(item.id) },
      });

      if (!product) continue;

      const newStock =
        Number(product.stock) - Number(item.qty);

      await prisma.product.update({
        where: { id: Number(item.id) },
        data: {
          stock: newStock < 0 ? 0 : newStock,
        },
      });
    }

    // 3. RETURN FULL ORDER (IMPORTANT FIX)
    const fullOrder = await prisma.order.findFirst({
      where: { id: order.id },

      include: {
        customer: true,

        items: {
          include: {
            product: true, // 🔥 THIS FIXES PRODUCT NAME
          },
        },
      },
    });

    return res.json(fullOrder);

  } catch (error) {
    console.log("CREATE ORDER ERROR:", error);

    return res.status(500).json({
      message: "Checkout failed",
    });
  }
};

// ==========================
// GET ORDERS
// ==========================
const getOrders = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        customer: true,

        items: {
          include: {
            product: true, // 🔥 REQUIRED FOR PRODUCT NAME
          },
        },
      },

      orderBy: {
        id: "desc",
      },
    });

    res.json(orders);

  } catch (error) {
    console.log("GET ORDERS ERROR:", error);

    res.status(500).json([]);
  }
};

module.exports = {
  createOrder,
  getOrders,
};