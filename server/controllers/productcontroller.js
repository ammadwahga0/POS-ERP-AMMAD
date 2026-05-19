const prisma = require("../config/prisma");

// CREATE PRODUCT
const createProduct = async (req, res) => {
  try {
    const { name, price, stock, barcode } = req.body;

    const product = await prisma.product.create({
      data: {
        name,
        price: parseFloat(price),
        stock: parseInt(stock),
        barcode,
      },
    });

    res.json(product);

  } catch (error) {
    res.status(500).json({ message: "Error creating product" });
  }
};

// GET ALL PRODUCTS
const getProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Error fetching products" });
  }
};

module.exports = {
  createProduct,
  getProducts,
};