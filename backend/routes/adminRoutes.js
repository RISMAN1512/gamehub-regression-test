const express = require("express");
const router = express.Router();

const {
  getDashboardAdmin,
  getAllTeams,
  updateTeamStatus,
  getStatistikAdmin,
} = require("../controllers/adminController");

// Dashboard admin
router.get("/dashboard", getDashboardAdmin);

// Kelola peserta
router.get("/teams", getAllTeams);

// Konfirmasi / tolak tim
router.put("/teams/:id/status", updateTeamStatus);

// Statistik admin
router.get("/statistik", getStatistikAdmin);

module.exports = router;
