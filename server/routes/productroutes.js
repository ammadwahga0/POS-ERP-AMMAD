const express = require("express");
const router = express.Router();

const prisma = require("../config/prisma");

// GET PRODUCTS
router.get("/", async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      orderBy: {
        id: "desc",
      },
    });

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
    const name = String(req.body.name || "").trim();

    if (!name) {
      return res.status(400).json({
        message: "Product name is required",
      });
    }

    const existingProduct = await prisma.product.findFirst({
      where: {
        name: {
          equals: name,
          mode: "insensitive",
        },
      },
    });

    if (existingProduct) {
      return res.status(400).json({
        message:
          "Product name already exists. Edit the existing product or delete it first.",
      });
    }

    const product = await prisma.product.create({
      data: {
        name,
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
    const id = Number(req.params.id);
    const name = String(req.body.name || "").trim();

    if (!name) {
      return res.status(400).json({
        message: "Product name is required",
      });
    }

    const existingProduct = await prisma.product.findFirst({
      where: {
        name: {
          equals: name,
          mode: "insensitive",
        },
        NOT: {
          id,
        },
      },
    });

    if (existingProduct) {
      return res.status(400).json({
        message:
          "Product name already exists. Edit the existing product or delete it first.",
      });
    }

    const updated = await prisma.product.update({
      where: {
        id,
      },
      data: {
        name,
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
    const id = Number(req.params.id);

    await prisma.product.delete({
      where: {
        id,
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