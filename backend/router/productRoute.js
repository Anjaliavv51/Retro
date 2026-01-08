const express = require("express");
const router = express.Router();
const Product = require("../model/productSchema");

// Middleware to handle CORS
router.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*"); // Adjust if needed
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

// Get all products
router.get("/productget", async (req, res) => {
  try {
    const products = await Product.find();
    if (products.length === 0) {
      return res.status(404).json({ error: "No products found" });
    }
    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get a product by ID
router.get("/productget/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ error: "Invalid Product ID or Internal Server Error" });
  }
});

// Add a new product
router.post("/productpost", async (req, res) => {
  try {
    const { name, price, description, imageUrl } = req.body;

    // Check if all required fields are provided
    if (!name || !price || !description || !imageUrl) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const newProduct = new Product({ name, price, description, imageUrl });
    await newProduct.save();
    res.status(201).json({ message: "Product added successfully", product: newProduct });
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(400).json({ error: "Invalid product data" });
  }
});

module.exports = router;
