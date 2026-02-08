const Cart = require("../models/Cart");
const Product = require("../models/Product");

// GET cart untuk user yang login
exports.getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user.id }).populate(
      "items.product",
      "name price imageUrl category stock"
    );

    if (!cart) {
      cart = await Cart.create({ user: req.user.id, items: [] });
    }

    res.json({
      cart,
      message: "Cart ditemukan",
      status: "success",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ADD item ke cart
exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product tidak ditemukan" });
    }

    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      cart = await Cart.create({ user: req.user.id, items: [] });
    }

    const existingItem = cart.items.find(
      (item) => item.product.toString() === productId
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }

    await cart.save();

    cart = await Cart.findOne({ user: req.user.id }).populate(
      "items.product",
      "name price imageUrl category stock"
    );

    res.json({
      cart,
      message: "Produk ditambahkan ke keranjang",
      status: "success",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE quantity item di cart
exports.updateCartItem = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    if (quantity < 1) {
      return res.status(400).json({ message: "Quantity minimal 1" });
    }

    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return res.status(404).json({ message: "Cart tidak ditemukan" });
    }

    const item = cart.items.find(
      (item) => item.product.toString() === productId
    );

    if (!item) {
      return res.status(404).json({ message: "Item tidak ada di keranjang" });
    }

    item.quantity = quantity;
    await cart.save();

    const updatedCart = await Cart.findOne({ user: req.user.id }).populate(
      "items.product",
      "name price imageUrl category stock"
    );

    res.json({
      cart: updatedCart,
      message: "Quantity diperbarui",
      status: "success",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// REMOVE item dari cart
exports.removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;

    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return res.status(404).json({ message: "Cart tidak ditemukan" });
    }

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId
    );

    await cart.save();

    const updatedCart = await Cart.findOne({ user: req.user.id }).populate(
      "items.product",
      "name price imageUrl category stock"
    );

    res.json({
      cart: updatedCart,
      message: "Item dihapus dari keranjang",
      status: "success",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// CLEAR semua item di cart
exports.clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return res.status(404).json({ message: "Cart tidak ditemukan" });
    }

    cart.items = [];
    await cart.save();

    res.json({
      cart,
      message: "Keranjang dikosongkan",
      status: "success",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
