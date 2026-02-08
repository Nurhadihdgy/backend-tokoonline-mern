const express = require("express");
const router = express.Router();

const controller = require("../controllers/orderController");
const { auth, adminOnly } = require("../middlewares/auth");

router.get("/orders", auth, adminOnly, controller.getAllOrders);
router.get("/orders/:id", auth, adminOnly, controller.getOrderByIdAdmin);
router.put("/orders/:id/status", auth, adminOnly, controller.updateOrderStatus);

module.exports = router;
