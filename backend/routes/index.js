// routes/index.js
const express = require("express");
const router = express.Router();
const { verifyToken, isAdmin } = require("../middleware/auth");

const authCtrl = require("../controllers/authController");
const tournamentCtrl = require("../controllers/tournamentController");
const teamCtrl = require("../controllers/teamController");
const matchCtrl = require("../controllers/matchController");
const adminCtrl = require("../controllers/adminController");

// ── AUTH ROUTES ───────────────────────────────────────────────
router.post("/auth/register", authCtrl.register);
router.post("/auth/login", authCtrl.login);
router.get("/auth/profile", verifyToken, authCtrl.getProfile);
router.put("/auth/profile", verifyToken, authCtrl.updateProfile);
router.put("/auth/password", verifyToken, authCtrl.updatePassword);

// ── TOURNAMENT ROUTES ─────────────────────────────────────────
// Dipakai oleh web user dan admin
router.get("/tournaments", tournamentCtrl.getAll);
router.get("/tournaments/:id", tournamentCtrl.getOne);

// Dipakai oleh admin untuk membuat, edit, hapus turnamen
router.post("/tournaments", verifyToken, isAdmin, tournamentCtrl.create);
router.put("/tournaments/:id", verifyToken, isAdmin, tournamentCtrl.update);
router.delete("/tournaments/:id", verifyToken, isAdmin, tournamentCtrl.remove);

// ── TEAM ROUTES ───────────────────────────────────────────────
// User daftar tim
router.post("/teams/register", verifyToken, teamCtrl.register);

// User melihat tim miliknya sendiri
router.get("/teams/my", verifyToken, teamCtrl.getMyTeams);

// Admin melihat tim berdasarkan turnamen
router.get(
  "/teams/tournament/:tournamentId",
  verifyToken,
  isAdmin,
  teamCtrl.getByTournament,
);

// Admin ubah status tim lewat route lama
router.put("/teams/:id/status", verifyToken, isAdmin, teamCtrl.updateStatus);

// ── MATCH / BRACKET ROUTES ────────────────────────────────────
// User bisa melihat bracket
router.get("/matches/bracket/:tournamentId", matchCtrl.getBracket);

// Admin generate bracket otomatis
router.post(
  "/matches/generate/:tournamentId",
  verifyToken,
  isAdmin,
  matchCtrl.generateBracket,
);

// Admin buat match manual
router.post(
  "/matches/manual",
  verifyToken,
  isAdmin,
  matchCtrl.createManualMatch,
);

// Admin input hasil match
router.put("/matches/:id/hasil", verifyToken, isAdmin, matchCtrl.inputHasil);

// Alias lama untuk halaman AdminMatchPage jika masih ada yang memakai
router.put("/admin/matches/:id", verifyToken, isAdmin, matchCtrl.inputHasil);

// ── ADMIN DASHBOARD ROUTES ────────────────────────────────────
// Dashboard admin otomatis
router.get(
  "/admin/dashboard",
  verifyToken,
  isAdmin,
  adminCtrl.getDashboardAdmin,
);

// Admin melihat semua tim yang mendaftar
router.get("/admin/teams", verifyToken, isAdmin, adminCtrl.getAllTeams);

// Admin konfirmasi / tolak tim
router.put(
  "/admin/teams/:id/status",
  verifyToken,
  isAdmin,
  adminCtrl.updateTeamStatus,
);

// Statistik admin
router.get(
  "/admin/statistik",
  verifyToken,
  isAdmin,
  adminCtrl.getStatistikAdmin,
);

module.exports = router;
