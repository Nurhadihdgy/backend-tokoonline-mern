const express = require("express");
const router = express.Router();

const controller = require("../controllers/orderController");
const { auth, userOnly } = require("../middlewares/auth");

router.post("/checkout", auth, userOnly, controller.checkout);
router.post("/:id/check-payment", auth, userOnly, controller.checkPayment);
router.get("/:id", auth, userOnly, controller.getOrderById);
router.get("/", auth, userOnly, controller.getOrders);

module.exports = router;
