const express = require("express");
const router = express.Router();

const controller = require("../controllers/cartController");
const { auth, userOnly } = require("../middlewares/auth");

router.get("/", auth, userOnly, controller.getCart);
router.post("/", auth, userOnly, controller.addToCart);
router.put("/:productId", auth, userOnly, controller.updateCartItem);
router.delete("/:productId", auth, userOnly, controller.removeFromCart);
router.delete("/", auth, userOnly, controller.clearCart);

module.exports = router;
