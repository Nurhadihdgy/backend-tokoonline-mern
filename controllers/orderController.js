const Order = require("../models/Order");
const Cart = require("../models/Cart");

// POST /api/orders/checkout - buat order dari cart
exports.checkout = async (req, res) => {
  try {
    const { paymentMethod } = req.body;

    if (!["cash", "qris"].includes(paymentMethod)) {
      return res.status(400).json({ message: "Metode pembayaran tidak valid" });
    }

    const cart = await Cart.findOne({ user: req.user.id }).populate(
      "items.product",
      "name price"
    );

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Keranjang kosong" });
    }

    const items = cart.items.map((item) => ({
      product: item.product._id,
      name: item.product.name,
      price: item.product.price,
      quantity: item.quantity,
    }));

    const totalPrice = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const order = await Order.create({
      user: req.user.id,
      items,
      totalPrice,
      paymentMethod,
      paymentStatus: paymentMethod === "cash" ? "paid" : "pending",
      orderStatus: paymentMethod === "cash" ? "forwarded_to_seller" : "waiting_payment",
    });

    // kosongkan cart setelah checkout
    cart.items = [];
    await cart.save();

    res.status(201).json({
      order,
      message: "Checkout berhasil",
      status: "success",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/orders/:id/check-payment - simulasi cek pembayaran QRIS
exports.checkPayment = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!order) {
      return res.status(404).json({ message: "Order tidak ditemukan" });
    }

    if (order.paymentStatus === "paid") {
      return res.json({
        order,
        message: "Pembayaran sudah dikonfirmasi sebelumnya",
        status: "success",
      });
    }

    // simulasi: langsung set paid
    order.paymentStatus = "paid";
    order.orderStatus = "forwarded_to_seller";
    await order.save();

    res.json({
      order,
      message: "Pembayaran berhasil dikonfirmasi",
      status: "success",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/orders/:id - detail order
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!order) {
      return res.status(404).json({ message: "Order tidak ditemukan" });
    }

    res.json({
      order,
      message: "Order ditemukan",
      status: "success",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/orders - semua order user
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort({
      createdAt: -1,
    });

    res.json({
      orders,
      message: "Orders ditemukan",
      status: "success",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ===================== ADMIN =====================

// GET /api/admin/orders - semua order (admin)
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.json({
      orders,
      message: "Semua order ditemukan",
      status: "success",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/admin/orders/:id - detail order (admin)
exports.getOrderByIdAdmin = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "user",
      "name email"
    );

    if (!order) {
      return res.status(404).json({ message: "Order tidak ditemukan" });
    }

    res.json({
      order,
      message: "Order ditemukan",
      status: "success",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/admin/orders/:id/status - update status order (admin)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus } = req.body;

    const validStatuses = [
      "waiting_payment",
      "forwarded_to_seller",
      "processing",
      "completed",
    ];

    if (!validStatuses.includes(orderStatus)) {
      return res.status(400).json({ message: "Status tidak valid" });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order tidak ditemukan" });
    }

    order.orderStatus = orderStatus;
    await order.save();

    res.json({
      order,
      message: "Status order diperbarui",
      status: "success",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
