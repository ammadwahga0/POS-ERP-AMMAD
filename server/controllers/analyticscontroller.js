const prisma = require("../config/prisma");

const getAnalytics = async (req, res) => {

  try {

    // TOTAL PRODUCTS
    const totalProducts = await prisma.product.count();

    // TOTAL CUSTOMERS
    const totalCustomers = await prisma.customer.count();

    // TOTAL ORDERS
    const totalOrders = await prisma.order.count();

    // TOTAL REVENUE
    const sales = await prisma.order.aggregate({
      _sum: {
        total: true,
      },
    });

    // LOW STOCK PRODUCTS
    const lowStock = await prisma.product.findMany({
      where: {
        stock: {
          lte: 5,
        },
      },
    });

    // RECENT ORDERS
    const recentOrders = await prisma.order.findMany({
      take: 5,
      orderBy: {
        id: "desc",
      },

      include: {
        customer: true,
      },
    });

    // TOP SELLING PRODUCTS
    const topProducts = await prisma.orderItem.groupBy({
      by: ["productId"],

      _sum: {
        quantity: true,
      },

      orderBy: {
        _sum: {
          quantity: "desc",
        },
      },

      take: 5,
    });

    res.json({

      totalRevenue: sales._sum.total || 0,

      totalOrders,

      totalProducts,

      totalCustomers,

      lowStock,

      recentOrders,

      topProducts,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Analytics failed",
    });
  }
};

module.exports = {
  getAnalytics,
};