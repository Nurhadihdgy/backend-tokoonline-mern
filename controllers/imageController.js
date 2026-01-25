const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const Product = require("../models/Product");

exports.getProductImage = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product || !product.imagePath) {
      return res.status(404).send("Image not found");
    }

    const fullPath = path.join(__dirname, "..", product.imagePath);

    const data = fs.readFileSync(fullPath);

    const iv = data.slice(0, 16);
    const encrypted = data.slice(16);

    const decipher = crypto.createDecipheriv(
      "aes-256-cbc",
      crypto.createHash("sha256").update(process.env.FILE_SECRET).digest(),
      iv
    );

    const decrypted = Buffer.concat([
      decipher.update(encrypted),
      decipher.final()
    ]);

    res.setHeader("Content-Type", "image/jpeg");
    res.send(decrypted);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
