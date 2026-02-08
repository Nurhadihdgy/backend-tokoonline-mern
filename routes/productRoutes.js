const express = require("express");
const router = express.Router();

const controller = require("../controllers/productController");
const upload = require("../middlewares/upload");
const { auth, adminOnly } = require("../middlewares/auth");

// Public routes (tanpa auth, bisa diakses tanpa login)
router.get("/", controller.getAllProducts);
router.get("/:id", controller.getProductById);


// Admin only routes
router.post("/", auth, adminOnly, upload.single("image"), controller.createProduct);
router.put("/:id", auth, adminOnly, upload.single("image"), controller.updateProduct);
router.delete("/:id", auth, adminOnly, controller.deleteProduct);

module.exports = router;
