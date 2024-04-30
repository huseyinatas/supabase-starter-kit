import * as crypto from "crypto";
export default async function kkHash(inputText: any, password: any) {
  const sha1 = crypto.createHash("sha1").update(password, "utf8").digest();
  const key = sha1.slice(0, 16);

  // AES-128-ECB modunda şifreleme (Node.js CBC modunda IV gerektirir, ECB IV kullanmaz)
  const cipher = crypto.createCipheriv("aes-128-ecb", key, null); // ECB modu için IV yok

  // Şifreleme işlemi
  let encrypted = cipher.update(inputText, "utf8", "base64");
  encrypted += cipher.final("base64");

  return encrypted;
}
