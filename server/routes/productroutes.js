const express = require("express");
const router = express.Router();

const prisma = require("../config/prisma");


// GET PRODUCTS
router.get("/", async (req, res) => {
  try {

    const products = await prisma.product.findMany();

    res.json(products);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Failed to fetch products",
    });
  }
});


// CREATE PRODUCT
router.post("/", async (req, res) => {
  try {

    const product = await prisma.product.create({
      data: {
        name: req.body.name,
        price: Number(req.body.price),
        stock: Number(req.body.stock),
      },
    });

    res.json(product);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Failed to create product",
    });
  }
});


// UPDATE PRODUCT
router.put("/:id", async (req, res) => {
  try {

    const id = parseInt(req.params.id);

    const updated = await prisma.product.update({
      where: {
        id: id,
      },
      data: {
        name: req.body.name,
        price: Number(req.body.price),
        stock: Number(req.body.stock),
      },
    });

    res.json(updated);

  } catch (error) {

    console.log("UPDATE ERROR:", error);

    res.status(500).json({
      message: "Failed to update product",
      error: error.message,
    });
  }
});


// DELETE PRODUCT
router.delete("/:id", async (req, res) => {
  try {

    const id = parseInt(req.params.id);

    await prisma.product.delete({
      where: {
        id: id,
      },
    });

    res.json({
      message: "Product deleted",
    });

  } catch (error) {

    console.log("DELETE ERROR:", error);

    res.status(500).json({
      message: "Failed to delete product",
      error: error.message,
    });
  }
});


module.exports = router;