const express = require("express");
const router = express.Router();

const controller = require("../controllers/productController");
const upload = require("../middlewares/upload");
const imageController = require("../controllers/imageController");
const { auth, adminOnly } = require("../middlewares/auth");
router.get("/:id/image", imageController.getProductImage);
// Public routes
router.get("/", auth, controller.getAllProducts);
router.get("/:id", auth, controller.getProductById);


// Admin only routes
router.post("/", auth, adminOnly, upload.single("image"), controller.createProduct);
router.put("/:id", auth, adminOnly, upload.single("image"), controller.updateProduct);
router.delete("/:id", auth, adminOnly, controller.deleteProduct);

module.exports = router;
