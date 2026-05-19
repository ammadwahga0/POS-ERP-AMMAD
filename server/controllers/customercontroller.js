const prisma = require("../config/prisma");

const getCustomers = async (req, res) => {
  try {
    const customers = await prisma.customer.findMany();
    res.json(customers);
  } catch (error) {
    console.log("GET CUSTOMER ERROR:", error);
    res.status(500).json([]);
  }
};

const createCustomer = async (req, res) => {
  try {

    const { name, phone } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Name required" });
    }

    const customer = await prisma.customer.create({
      data: {
        name: String(name),
        phone: phone ? String(phone) : null,
      },
    });

    res.json(customer);

  } catch (error) {
    console.log("CREATE CUSTOMER ERROR:", error);
    res.status(500).json({
      message: "Customer creation failed",
      error: error.message,
    });
  }
};

module.exports = {
  getCustomers,
  createCustomer,
};