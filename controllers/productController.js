const Product = require("../models/Product");
const { encryptAndSave } = require("../utils/encryptedFile");
const fs = require("fs");
const path = require("path");

// GET all products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json({ products, message: "Products ditemukan", status: "success" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET product by ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product tidak ditemukan" });
    }
    res.json({ product, message: "Product ditemukan", status: "success" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// CREATE product
exports.createProduct = async (req, res) => {
  try {
    let imagePath = null;

    if (req.file) {
      const filename = Date.now() + "-" + req.file.originalname;
      imagePath = encryptAndSave(req.file.buffer, filename);
    }

    const product = new Product({
      ...req.body,
      imagePath
    });

    await product.save();
    res.status(201).json({ product, message: "Product berhasil dibuat", status: "success" });

  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// UPDATE product
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product tidak ditemukan" });
    }

    // jika upload gambar baru
    if (req.file) {
      // hapus file lama (jika ada)
      if (product.imagePath && fs.existsSync(product.imagePath)) {
        fs.unlinkSync(product.imagePath);
      }

      const filename = Date.now() + "-" + req.file.originalname;
      product.imagePath = encryptAndSave(req.file.buffer, filename);
    }

    // update field lain
    Object.assign(product, req.body);
    await product.save();

    res.json({
      product,
      message: "Product diperbarui berhasil",
      status: "success"
    });

  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// DELETE product
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product tidak ditemukan" });
    }

    // hapus file terenkripsi
    if (product.imagePath && fs.existsSync(product.imagePath)) {
      fs.unlinkSync(product.imagePath);
    }

    await product.deleteOne();

    res.json({
      message: "Product dihapus berhasil",
      status: "success"
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};