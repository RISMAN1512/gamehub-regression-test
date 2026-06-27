const { Op } = require("sequelize");
const { Match, Team, Tournament } = require("../models");

const getBracket = async (req, res) => {
  try {
    const matches = await Match.findAll({
      where: { tournament_id: req.params.tournamentId },
      include: [
        { model: Team, as: "team1", attributes: ["id", "nama_tim", "status"] },
        { model: Team, as: "team2", attributes: ["id", "nama_tim", "status"] },
        { model: Team, as: "pemenang", attributes: ["id", "nama_tim"] },
      ],
      order: [["ronde", "ASC"], ["urutan", "ASC"]],
    });
    return res.status(200).json(matches);
  } catch (err) {
    console.error("GET BRACKET ERROR:", err);
    return res.status(500).json({ message: "Terjadi kesalahan server.", error: err.message });
  }
};

const generateBracket = async (req, res) => {
  try {
    const { tournamentId } = req.params;
    const teams = await Team.findAll({
      where: { tournament_id: tournamentId, status: "terkonfirmasi" },
    });

    if (teams.length < 2) {
      return res.status(400).json({ message: "Minimal 2 tim terkonfirmasi untuk membuat bracket." });
    }

    await Match.destroy({ where: { tournament_id: tournamentId } });

    const shuffled = teams.sort(() => Math.random() - 0.5);
    const matches = [];

    for (let i = 0; i < shuffled.length; i += 2) {
      matches.push({
        tournament_id: tournamentId,
        ronde: 1,
        urutan: Math.floor(i / 2) + 1,
        team1_id: shuffled[i]?.id || null,
        team2_id: shuffled[i + 1]?.id || null,
        status: "menunggu",
      });
    }

    await Match.bulkCreate(matches);
    await Tournament.update({ status: "berlangsung" }, { where: { id: tournamentId } });

    return res.status(201).json({ message: "Bracket otomatis berhasil dibuat!", total_match: matches.length });
  } catch (err) {
    console.error("GENERATE BRACKET ERROR:", err);
    return res.status(500).json({ message: "Terjadi kesalahan server.", error: err.message });
  }
};

const createManualMatch = async (req, res) => {
  try {
    const { tournament_id, ronde, urutan, team1_id, team2_id, jadwal } = req.body;

    if (!tournament_id || !ronde || !urutan || !team1_id || !team2_id) {
      return res.status(400).json({ message: "Data match belum lengkap." });
    }

    if (Number(team1_id) === Number(team2_id)) {
      return res.status(400).json({ message: "Team 1 dan Team 2 tidak boleh sama." });
    }

    const tournament = await Tournament.findByPk(tournament_id);
    if (!tournament) {
      return res.status(404).json({ message: "Turnamen tidak ditemukan." });
    }

    const team1 = await Team.findOne({ where: { id: team1_id, tournament_id, status: "terkonfirmasi" } });
    const team2 = await Team.findOne({ where: { id: team2_id, tournament_id, status: "terkonfirmasi" } });

    if (!team1 || !team2) {
      return res.status(400).json({ message: "Tim harus sudah terkonfirmasi dan berada di turnamen yang sama." });
    }

    const existingMatch = await Match.findOne({ where: { tournament_id, ronde, urutan } });
    if (existingMatch) {
      return res.status(409).json({ message: "Ronde dan urutan match ini sudah digunakan." });
    }

    // FIX BUG-GAMEHUB-02: Cek konflik jadwal
    if (jadwal) {
      const conflict = await Match.findOne({
        where: {
          tournament_id,
          jadwal,
          [Op.or]: [
            { team1_id: team1_id },
            { team2_id: team1_id },
            { team1_id: team2_id },
            { team2_id: team2_id },
          ],
        },
      });

      if (conflict) {
        return res.status(409).json({
          message: "Salah satu tim sudah memiliki jadwal pertandingan pada waktu yang sama.",
        });
      }
    }

    const match = await Match.create({
      tournament_id,
      ronde,
      urutan,
      team1_id,
      team2_id,
      jadwal: jadwal || null,
      status: "menunggu",
    });

    await Tournament.update({ status: "berlangsung" }, { where: { id: tournament_id } });

    return res.status(201).json({ message: "Match manual berhasil dibuat.", match });
  } catch (err) {
    console.error("CREATE MANUAL MATCH ERROR:", err);
    return res.status(500).json({ message: "Terjadi kesalahan server.", error: err.message });
  }
};

const inputHasil = async (req, res) => {
  try {
    const { skor_team1, skor_team2, pemenang_id } = req.body;
    const match = await Match.findByPk(req.params.id);

    if (!match) {
      return res.status(404).json({ message: "Match tidak ditemukan." });
    }

    await match.update({ skor_team1, skor_team2, pemenang_id, status: "selesai" });

    return res.status(200).json({ message: "Hasil match berhasil disimpan.", match });
  } catch (err) {
    console.error("INPUT HASIL ERROR:", err);
    return res.status(500).json({ message: "Terjadi kesalahan server.", error: err.message });
  }
};

module.exports = { getBracket, generateBracket, createManualMatch, inputHasil };