const jwt = require("jsonwebtoken");
require("dotenv").config();

// ── Verifikasi token JWT ──────────────────────────────────────
const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer <token>

  if (!token) {
    return res
      .status(401)
      .json({ message: "Akses ditolak. Token tidak ditemukan." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res
      .status(403)
      .json({ message: "Token tidak valid atau sudah kadaluarsa." });
  }
};

// ── Hanya admin yang boleh akses ─────────────────────────────
const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res
      .status(403)
      .json({ message: "Akses ditolak. Hanya admin yang diizinkan." });
  }
  next();
};

module.exports = { verifyToken, isAdmin };
