// models/index.js
const sequelize = require("../config/database");
const { DataTypes } = require("sequelize");

// ── USER ─────────────────────────────────────────────────────
const User = sequelize.define(
  "User",
  {
    nama: { type: DataTypes.STRING(100), allowNull: false },
    email: { type: DataTypes.STRING(100), allowNull: false, unique: true },
    password: { type: DataTypes.STRING(255), allowNull: false },
    nim: { type: DataTypes.STRING(20), allowNull: true },
    role: { type: DataTypes.ENUM("pemain", "admin"), defaultValue: "pemain" },
    game_favorit: { type: DataTypes.STRING(50), allowNull: true },
    bio: { type: DataTypes.TEXT, allowNull: true },
  },
  { tableName: "users", timestamps: true, underscored: true },
);

// ── TOURNAMENT ────────────────────────────────────────────────
const Tournament = sequelize.define(
  "Tournament",
  {
    nama: { type: DataTypes.STRING(150), allowNull: false },
    game: {
      type: DataTypes.ENUM("mobile_legends", "pubg_mobile", "efootball"),
      allowNull: false,
    },
    format: { type: DataTypes.STRING(50), allowNull: false },
    tipe: {
      type: DataTypes.ENUM("single_elimination"),
      defaultValue: "single_elimination",
    },
    max_tim: { type: DataTypes.INTEGER, defaultValue: 16 },
    slot_tersisa: { type: DataTypes.INTEGER, defaultValue: 16 },
    tanggal_mulai: { type: DataTypes.DATEONLY, allowNull: false },
    tanggal_selesai: { type: DataTypes.DATEONLY, allowNull: true },
    status: {
      type: DataTypes.ENUM("open", "penuh", "berlangsung", "selesai"),
      defaultValue: "open",
    },
    deskripsi: { type: DataTypes.TEXT, allowNull: true },
    created_by: { type: DataTypes.INTEGER, allowNull: false },
  },
  { tableName: "tournaments", timestamps: true, underscored: true },
);

// ── TEAM ──────────────────────────────────────────────────────
const Team = sequelize.define(
  "Team",
  {
    nama_tim: { type: DataTypes.STRING(100), allowNull: false },
    tournament_id: { type: DataTypes.INTEGER, allowNull: false },
    captain_id: { type: DataTypes.INTEGER, allowNull: false },
    status: {
      type: DataTypes.ENUM("pending", "terkonfirmasi", "ditolak"),
      defaultValue: "pending",
    },
  },
  { tableName: "teams", timestamps: true, underscored: true },
);

// ── TEAM MEMBER ───────────────────────────────────────────────
const TeamMember = sequelize.define(
  "TeamMember",
  {
    team_id: { type: DataTypes.INTEGER, allowNull: false },
    user_id: { type: DataTypes.INTEGER, allowNull: true },
    nama_pemain: { type: DataTypes.STRING(100), allowNull: false },
  },
  {
    tableName: "team_members",
    timestamps: true,
    underscored: true,
    updatedAt: false,
  },
);

// ── MATCH ─────────────────────────────────────────────────────
const Match = sequelize.define(
  "Match",
  {
    tournament_id: { type: DataTypes.INTEGER, allowNull: false },
    ronde: { type: DataTypes.INTEGER, allowNull: false },
    urutan: { type: DataTypes.INTEGER, allowNull: false },
    team1_id: { type: DataTypes.INTEGER, allowNull: true },
    team2_id: { type: DataTypes.INTEGER, allowNull: true },
    skor_team1: { type: DataTypes.INTEGER, allowNull: true },
    skor_team2: { type: DataTypes.INTEGER, allowNull: true },
    pemenang_id: { type: DataTypes.INTEGER, allowNull: true },
    status: {
      type: DataTypes.ENUM("menunggu", "berlangsung", "selesai"),
      defaultValue: "menunggu",
    },
    jadwal: { type: DataTypes.DATE, allowNull: true },
  },
  { tableName: "matches", timestamps: true, underscored: true },
);

// ── ASSOCIATIONS ──────────────────────────────────────────────
Tournament.belongsTo(User, { foreignKey: "created_by", as: "creator" });
Tournament.hasMany(Team, { foreignKey: "tournament_id", as: "teams" });
Tournament.hasMany(Match, { foreignKey: "tournament_id", as: "matches" });

Team.belongsTo(Tournament, { foreignKey: "tournament_id", as: "tournament" });

// Alias untuk kapten tim
Team.belongsTo(User, { foreignKey: "captain_id", as: "captain" });

// Alias tambahan supaya adminController bisa memanggil team.user
Team.belongsTo(User, { foreignKey: "captain_id", as: "user" });

Team.hasMany(TeamMember, { foreignKey: "team_id", as: "members" });

TeamMember.belongsTo(Team, { foreignKey: "team_id" });
TeamMember.belongsTo(User, { foreignKey: "user_id", as: "user" });

Match.belongsTo(Tournament, { foreignKey: "tournament_id" });
Match.belongsTo(Team, { foreignKey: "team1_id", as: "team1" });
Match.belongsTo(Team, { foreignKey: "team2_id", as: "team2" });
Match.belongsTo(Team, { foreignKey: "pemenang_id", as: "pemenang" });

module.exports = { sequelize, User, Tournament, Team, TeamMember, Match };
