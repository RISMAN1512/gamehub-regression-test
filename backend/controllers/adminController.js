const { Op } = require("sequelize");
const { User, Tournament, Team, Match } = require("../models");

// ── DASHBOARD ADMIN ───────────────────────────────────────────
const getDashboardAdmin = async (req, res) => {
  try {
    const turnamenAktif = await Tournament.count({
      where: {
        status: "open",
      },
    });

    const totalTim = await Team.count();

    const matchSelesai = await Match.count({
      where: {
        pemenang_id: {
          [Op.ne]: null,
        },
      },
    });

    const pendingPendaftaran = await Team.count({
      where: {
        status: "pending",
      },
    });

    const pendaftaranMasuk = await Team.findAll({
      where: {
        status: "pending",
      },
      include: [
        {
          model: Tournament,
          as: "tournament",
          required: false,
        },
        {
          model: User,
          as: "user",
          attributes: ["id", "nama", "email"],
          required: false,
        },
      ],
      order: [["createdAt", "DESC"]],
      limit: 5,
    });

    const turnamen = await Tournament.findAll({
      order: [["createdAt", "DESC"]],
      limit: 5,
    });

    return res.status(200).json({
      stats: {
        turnamenAktif,
        totalTim,
        matchSelesai,
        pendingPendaftaran,
      },
      pendaftaranMasuk,
      turnamen,
    });
  } catch (err) {
    console.error("ADMIN DASHBOARD ERROR:", err);

    return res.status(500).json({
      message: "Gagal mengambil data dashboard admin.",
      error: err.message,
    });
  }
};

// ── AMBIL SEMUA TIM UNTUK KELOLA PESERTA ─────────────────────
const getAllTeams = async (req, res) => {
  try {
    const teams = await Team.findAll({
      include: [
        {
          model: Tournament,
          as: "tournament",
          required: false,
        },
        {
          model: User,
          as: "user",
          attributes: ["id", "nama", "email"],
          required: false,
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json(teams);
  } catch (err) {
    console.error("GET ALL TEAMS ERROR:", err);

    return res.status(500).json({
      message: "Gagal mengambil data tim.",
      error: err.message,
    });
  }
};

// ── UPDATE STATUS TIM ─────────────────────────────────────────
const updateTeamStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["pending", "terkonfirmasi", "ditolak"].includes(status)) {
      return res.status(400).json({
        message: "Status tidak valid.",
      });
    }

    const team = await Team.findByPk(id, {
      include: [
        {
          model: Tournament,
          as: "tournament",
        },
      ],
    });

    if (!team) {
      return res.status(404).json({
        message: "Tim tidak ditemukan.",
      });
    }

    const statusSebelumnya = team.status;

    // Update status tim
    await team.update({
      status,
    });

    // Jika admin klik OK / terkonfirmasi
    // Maka slot turnamen berkurang 1
    if (status === "terkonfirmasi" && statusSebelumnya !== "terkonfirmasi") {
      await Tournament.decrement("slot_tersisa", {
        by: 1,
        where: {
          id: team.tournament_id,
        },
      });

      const tournament = await Tournament.findByPk(team.tournament_id);

      // Jika slot sudah habis, status turnamen menjadi penuh
      if (tournament && tournament.slot_tersisa <= 0) {
        await tournament.update({
          status: "penuh",
        });
      }
    }

    // Jika sebelumnya sudah terkonfirmasi,
    // lalu admin ubah menjadi ditolak atau pending,
    // maka slot dikembalikan 1
    if (statusSebelumnya === "terkonfirmasi" && status !== "terkonfirmasi") {
      await Tournament.increment("slot_tersisa", {
        by: 1,
        where: {
          id: team.tournament_id,
        },
      });

      const tournament = await Tournament.findByPk(team.tournament_id);

      // Jika sebelumnya penuh, buka lagi karena slot sudah bertambah
      if (tournament && tournament.status === "penuh") {
        await tournament.update({
          status: "open",
        });
      }
    }

    return res.status(200).json({
      message: `Status tim berhasil diubah menjadi ${status}.`,
      team,
    });
  } catch (err) {
    console.error("UPDATE TEAM STATUS ERROR:", err);

    return res.status(500).json({
      message: "Gagal mengubah status tim.",
      error: err.message,
    });
  }
};

// ── STATISTIK ADMIN ───────────────────────────────────────────
const getStatistikAdmin = async (req, res) => {
  try {
    const totalTurnamen = await Tournament.count();
    const totalTim = await Team.count();
    const totalUser = await User.count();

    const totalMatchSelesai = await Match.count({
      where: {
        pemenang_id: {
          [Op.ne]: null,
        },
      },
    });

    const pendingPendaftaran = await Team.count({
      where: {
        status: "pending",
      },
    });

    return res.status(200).json({
      totalTurnamen,
      totalTim,
      totalUser,
      totalMatchSelesai,
      pendingPendaftaran,
    });
  } catch (err) {
    console.error("ADMIN STATISTIK ERROR:", err);

    return res.status(500).json({
      message: "Gagal mengambil statistik admin.",
      error: err.message,
    });
  }
};

module.exports = {
  getDashboardAdmin,
  getAllTeams,
  updateTeamStatus,
  getStatistikAdmin,
};
