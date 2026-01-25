const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const algorithm = "aes-256-cbc";
const secretKey = crypto
  .createHash("sha256")
  .update(process.env.FILE_SECRET)
  .digest();

module.exports.encryptAndSave = (buffer, filename) => {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, secretKey, iv);

  const encrypted = Buffer.concat([
    cipher.update(buffer),
    cipher.final()
  ]);

  const filePath = path.join("uploads", `${filename}.enc`);
  fs.writeFileSync(filePath, Buffer.concat([iv, encrypted]));

  return filePath;
};