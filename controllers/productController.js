const Product = require("../models/Product");
const cloudinary = require("../utils/cloudinary");
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
    let imageUrl = null;
    let imagePublicId = null;

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "tokoonline/products",
        resource_type: "image",
        transformation: [
          { width: 800, height: 800, crop: "limit" },
          { quality: "auto", fetch_format: "auto" }
        ]
      });

      imageUrl = result.secure_url;
      imagePublicId = result.public_id;
    }

    const product = await Product.create({
      ...req.body,
      imageUrl,
      imagePublicId
    });

    res.status(201).json({
      product,
      message: "Product berhasil dibuat",
      status: "success"
    });

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
      // hapus gambar lama di Cloudinary
      if (product.imagePublicId) {
        await cloudinary.uploader.destroy(product.imagePublicId);
      }

      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "tokoonline/products",
        resource_type: "image",
        transformation: [
          { width: 800, height: 800, crop: "limit" },
          { quality: "auto", fetch_format: "auto" }
        ]
      });

      product.imageUrl = result.secure_url;
      product.imagePublicId = result.public_id;
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

    if (product.imagePublicId) {
      await cloudinary.uploader.destroy(product.imagePublicId);
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
