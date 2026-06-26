const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../models");
require("dotenv").config();

// ── REGISTER ─────────────────────────────────────────────────
const register = async (req, res) => {
  try {
    const { nama, email, password, nim } = req.body;

    if (!nama || !email || !password) {
      return res
        .status(400)
        .json({ message: "Nama, email, dan password wajib diisi." });
    }

    const existing = await User.findOne({ where: { email } });

    if (existing) {
      return res.status(409).json({ message: "Email sudah terdaftar." });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      nama,
      email,
      password: hashed,
      nim,
    });

    return res.status(201).json({
      message: "Registrasi berhasil!",
      user: {
        id: user.id,
        nama: user.nama,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      message: "Terjadi kesalahan server.",
    });
  }
};

// ── LOGIN ─────────────────────────────────────────────────────
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email dan password wajib diisi." });
    }

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: "Email tidak ditemukan." });
    }

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      return res.status(401).json({ message: "Password salah." });
    }

    const token = jwt.sign(
      {
        id: user.id,
        nama: user.nama,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET || "gamehub_secret",
      {
        expiresIn:
          process.env.JWT_EXPIRES || process.env.JWT_EXPIRES_IN || "1d",
      },
    );

    return res.status(200).json({
      message: "Login berhasil!",
      token,
      user: {
        id: user.id,
        nama: user.nama,
        email: user.email,
        role: user.role,
        nim: user.nim,
      },
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      message: "Terjadi kesalahan server.",
    });
  }
};

// ── GET PROFILE ───────────────────────────────────────────────
const getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ["password"] },
    });

    return res.status(200).json(user);
  } catch (err) {
    return res.status(500).json({
      message: "Terjadi kesalahan server.",
    });
  }
};

// ── UPDATE PROFILE ────────────────────────────────────────────
const updateProfile = async (req, res) => {
  try {
    const { nama, nim, game_favorit, bio } = req.body;

    await User.update(
      {
        nama,
        nim,
        game_favorit,
        bio,
      },
      {
        where: { id: req.user.id },
      },
    );

    return res.status(200).json({
      message: "Profil berhasil diperbarui.",
    });
  } catch (err) {
    return res.status(500).json({
      message: "Terjadi kesalahan server.",
    });
  }
};

// ── UPDATE PASSWORD ───────────────────────────────────────────
const updatePassword = async (req, res) => {
  try {
    const { password_lama, password_baru } = req.body;

    const user = await User.findByPk(req.user.id);

    const valid = await bcrypt.compare(password_lama, user.password);

    if (!valid) {
      return res.status(401).json({
        message: "Password lama salah.",
      });
    }

    const hashed = await bcrypt.hash(password_baru, 10);

    await User.update(
      {
        password: hashed,
      },
      {
        where: { id: req.user.id },
      },
    );

    return res.status(200).json({
      message: "Password berhasil diperbarui.",
    });
  } catch (err) {
    return res.status(500).json({
      message: "Terjadi kesalahan server.",
    });
  }
};

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  updatePassword,
};
