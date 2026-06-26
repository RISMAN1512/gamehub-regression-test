const { Team, TeamMember, Tournament, User } = require("../models");

// ── DAFTAR TIM KE TURNAMEN ────────────────────────────────────
const register = async (req, res) => {
  try {
    const { tournament_id, nama_tim, anggota, members } = req.body;

    // Frontend bisa mengirim "anggota" atau "members"
    const dataAnggota = anggota || members;

    if (
      !tournament_id ||
      !nama_tim ||
      !dataAnggota ||
      dataAnggota.length === 0
    ) {
      return res.status(400).json({
        message: "Data tim tidak lengkap.",
      });
    }

    // Bersihkan format anggota
    // Jika frontend mengirim string: ["Risman", "Waliyul"]
    // Jika frontend mengirim object: [{ nama_pemain: "Risman" }]
    const anggotaBersih = dataAnggota
      .map((item) => {
        if (typeof item === "string") {
          return {
            nama_pemain: item.trim(),
          };
        }

        return {
          nama_pemain: item.nama_pemain?.trim(),
        };
      })
      .filter((item) => item.nama_pemain);

    if (anggotaBersih.length === 0) {
      return res.status(400).json({
        message: "Minimal isi 1 anggota tim.",
      });
    }

    const tournament = await Tournament.findByPk(tournament_id);

    if (!tournament) {
      return res.status(404).json({
        message: "Turnamen tidak ditemukan.",
      });
    }

    if (tournament.status === "penuh" || tournament.slot_tersisa <= 0) {
      return res.status(400).json({
        message: "Slot turnamen sudah penuh.",
      });
    }

    // Cek apakah user sudah punya tim di turnamen ini
    const existing = await Team.findOne({
      where: {
        tournament_id,
        captain_id: req.user.id,
      },
    });

    if (existing) {
      return res.status(409).json({
        message: "Kamu sudah mendaftarkan tim di turnamen ini.",
      });
    }

    // Buat tim dengan status default pending
    const team = await Team.create({
      nama_tim,
      tournament_id,
      captain_id: req.user.id,
      status: "pending",
    });

    // Buat anggota tim
    const membersData = anggotaBersih.map((item) => ({
      team_id: team.id,
      nama_pemain: item.nama_pemain,
    }));

    await TeamMember.bulkCreate(membersData);

    return res.status(201).json({
      message: "Tim berhasil didaftarkan! Menunggu konfirmasi admin.",
      team,
    });
  } catch (err) {
    console.error("REGISTER TEAM ERROR:", err);
    return res.status(500).json({
      message: "Terjadi kesalahan server.",
      error: err.message,
    });
  }
};

// ── GET TIM SAYA ──────────────────────────────────────────────
const getMyTeams = async (req, res) => {
  try {
    const teams = await Team.findAll({
      where: {
        captain_id: req.user.id,
      },
      include: [
        {
          model: Tournament,
          as: "tournament",
          attributes: [
            "id",
            "nama",
            "game",
            "status",
            "tanggal_mulai",
            "format",
          ],
        },
        {
          model: TeamMember,
          as: "members",
        },
      ],
      order: [["created_at", "DESC"]],
    });

    return res.status(200).json(teams);
  } catch (err) {
    console.error("GET MY TEAMS ERROR:", err);
    return res.status(500).json({
      message: "Terjadi kesalahan server.",
      error: err.message,
    });
  }
};

// ── GET SEMUA TIM SUATU TURNAMEN (ADMIN) ──────────────────────
const getByTournament = async (req, res) => {
  try {
    const teams = await Team.findAll({
      where: {
        tournament_id: req.params.tournamentId,
      },
      include: [
        {
          model: User,
          as: "captain",
          attributes: ["id", "nama", "email"],
        },
        {
          model: TeamMember,
          as: "members",
        },
      ],
      order: [["created_at", "ASC"]],
    });

    return res.status(200).json(teams);
  } catch (err) {
    console.error("GET TEAMS BY TOURNAMENT ERROR:", err);
    return res.status(500).json({
      message: "Terjadi kesalahan server.",
      error: err.message,
    });
  }
};

// ── KONFIRMASI / TOLAK TIM (ADMIN) ───────────────────────────
const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["pending", "terkonfirmasi", "ditolak"].includes(status)) {
      return res.status(400).json({
        message: "Status tidak valid.",
      });
    }

    const team = await Team.findByPk(req.params.id, {
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

    const prevStatus = team.status;

    await team.update({
      status,
    });

    // Jika admin konfirmasi tim, kurangi slot turnamen
    if (status === "terkonfirmasi" && prevStatus !== "terkonfirmasi") {
      await Tournament.decrement("slot_tersisa", {
        by: 1,
        where: {
          id: team.tournament_id,
        },
      });

      const tournament = await Tournament.findByPk(team.tournament_id);

      if (tournament && tournament.slot_tersisa <= 0) {
        await tournament.update({
          status: "penuh",
        });
      }
    }

    // Jika sebelumnya terkonfirmasi lalu diubah menjadi ditolak/pending, kembalikan slot
    if (prevStatus === "terkonfirmasi" && status !== "terkonfirmasi") {
      await Tournament.increment("slot_tersisa", {
        by: 1,
        where: {
          id: team.tournament_id,
        },
      });

      const tournament = await Tournament.findByPk(team.tournament_id);

      if (tournament && tournament.status === "penuh") {
        await tournament.update({
          status: "open",
        });
      }
    }

    return res.status(200).json({
      message: `Tim berhasil di-${status}.`,
      team,
    });
  } catch (err) {
    console.error("UPDATE TEAM STATUS ERROR:", err);
    return res.status(500).json({
      message: "Terjadi kesalahan server.",
      error: err.message,
    });
  }
};

module.exports = {
  register,
  getMyTeams,
  getByTournament,
  updateStatus,
};
