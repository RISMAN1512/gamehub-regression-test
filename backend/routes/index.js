// routes/index.js
const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const { verifyToken, isAdmin } = require("../middleware/auth");

const authCtrl = require("../controllers/authController");
const tournamentCtrl = require("../controllers/tournamentController");
const teamCtrl = require("../controllers/teamController");
const matchCtrl = require("../controllers/matchController");
const adminCtrl = require("../controllers/adminController");

// ── VALIDASI INPUT TURNAMEN ───────────────────────────────────
const validateTournament = [
  body("nama").notEmpty().trim().escape().withMessage("Nama wajib diisi"),
  body("game")
    .isIn(["mobile_legends", "pubg_mobile", "efootball"])
    .withMessage("Game tidak valid"),
  body("format").notEmpty().trim().escape().withMessage("Format wajib diisi"),
  body("tanggal_mulai").isISO8601().withMessage("Tanggal mulai tidak valid"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: "Validasi gagal", errors: errors.array() });
    }
    next();
  },
];

// ── AUTH ROUTES ───────────────────────────────────────────────
router.post("/auth/register", authCtrl.register);
router.post("/auth/login", authCtrl.login);
router.get("/auth/profile", verifyToken, authCtrl.getProfile);
router.put("/auth/profile", verifyToken, authCtrl.updateProfile);
router.put("/auth/password", verifyToken, authCtrl.updatePassword);

// ── TOURNAMENT ROUTES ─────────────────────────────────────────
router.get("/tournaments", tournamentCtrl.getAll);
router.get("/tournaments/:id", tournamentCtrl.getOne);

router.post("/tournaments", verifyToken, isAdmin, validateTournament, tournamentCtrl.create);
router.put("/tournaments/:id", verifyToken, isAdmin, validateTournament, tournamentCtrl.update);
router.delete("/tournaments/:id", verifyToken, isAdmin, tournamentCtrl.remove);

// ── TEAM ROUTES ───────────────────────────────────────────────
router.post("/teams/register", verifyToken, teamCtrl.register);
router.get("/teams/my", verifyToken, teamCtrl.getMyTeams);
router.get("/teams/tournament/:tournamentId", verifyToken, isAdmin, teamCtrl.getByTournament);
router.put("/teams/:id/status", verifyToken, isAdmin, teamCtrl.updateStatus);

// ── MATCH / BRACKET ROUTES ────────────────────────────────────
router.get("/matches/bracket/:tournamentId", matchCtrl.getBracket);
router.post("/matches/generate/:tournamentId", verifyToken, isAdmin, matchCtrl.generateBracket);
router.post("/matches/manual", verifyToken, isAdmin, matchCtrl.createManualMatch);
router.put("/matches/:id/hasil", verifyToken, isAdmin, matchCtrl.inputHasil);
router.put("/admin/matches/:id", verifyToken, isAdmin, matchCtrl.inputHasil);

// ── ADMIN DASHBOARD ROUTES ────────────────────────────────────
router.get("/admin/dashboard", verifyToken, isAdmin, adminCtrl.getDashboardAdmin);
router.get("/admin/teams", verifyToken, isAdmin, adminCtrl.getAllTeams);
router.put("/admin/teams/:id/status", verifyToken, isAdmin, adminCtrl.updateTeamStatus);
router.get("/admin/statistik", verifyToken, isAdmin, adminCtrl.getStatistikAdmin);

module.exports = router;