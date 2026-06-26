const { Tournament, Team, User } = require("../models");

// ── GET ALL TOURNAMENTS ───────────────────────────────────────
const getAll = async (req, res) => {
  try {
    const { game, status } = req.query;
    const where = {};
    if (game) where.game = game;
    if (status) where.status = status;

    const tournaments = await Tournament.findAll({
      where,
      include: [{ model: User, as: "creator", attributes: ["id", "nama"] }],
      order: [["created_at", "DESC"]],
    });
    return res.status(200).json(tournaments);
  } catch (err) {
    return res.status(500).json({ message: "Terjadi kesalahan server." });
  }
};

// ── GET ONE TOURNAMENT ────────────────────────────────────────
const getOne = async (req, res) => {
  try {
    const tournament = await Tournament.findByPk(req.params.id, {
      include: [
        { model: User, as: "creator", attributes: ["id", "nama"] },
        {
          model: Team,
          as: "teams",
          include: [{ model: User, as: "captain", attributes: ["id", "nama"] }],
        },
      ],
    });
    if (!tournament)
      return res.status(404).json({ message: "Turnamen tidak ditemukan." });
    return res.status(200).json(tournament);
  } catch (err) {
    return res.status(500).json({ message: "Terjadi kesalahan server." });
  }
};

// ── CREATE TOURNAMENT (admin) ─────────────────────────────────
const create = async (req, res) => {
  try {
    const { nama, game, format, max_tim, tanggal_mulai, deskripsi } = req.body;
    if (!nama || !game || !format || !tanggal_mulai) {
      return res
        .status(400)
        .json({ message: "Field wajib tidak boleh kosong." });
    }
    const tournament = await Tournament.create({
      nama,
      game,
      format,
      max_tim: max_tim || 16,
      slot_tersisa: max_tim || 16,
      tanggal_mulai,
      deskripsi,
      created_by: req.user.id,
    });
    return res
      .status(201)
      .json({ message: "Turnamen berhasil dibuat!", tournament });
  } catch (err) {
    return res.status(500).json({ message: "Terjadi kesalahan server." });
  }
};

// ── UPDATE TOURNAMENT (admin) ─────────────────────────────────
const update = async (req, res) => {
  try {
    const tournament = await Tournament.findByPk(req.params.id);
    if (!tournament)
      return res.status(404).json({ message: "Turnamen tidak ditemukan." });
    await tournament.update(req.body);
    return res
      .status(200)
      .json({ message: "Turnamen berhasil diperbarui.", tournament });
  } catch (err) {
    return res.status(500).json({ message: "Terjadi kesalahan server." });
  }
};

// ── DELETE TOURNAMENT (admin) ─────────────────────────────────
const remove = async (req, res) => {
  try {
    const tournament = await Tournament.findByPk(req.params.id);
    if (!tournament)
      return res.status(404).json({ message: "Turnamen tidak ditemukan." });
    await tournament.destroy();
    return res.status(200).json({ message: "Turnamen berhasil dihapus." });
  } catch (err) {
    return res.status(500).json({ message: "Terjadi kesalahan server." });
  }
};

module.exports = { getAll, getOne, create, update, remove };
