const request = require("supertest");
const bcrypt = require("bcryptjs");
const app = require("../app");
const { sequelize, User, Tournament } = require("../models");

let adminToken;
let tournamentId;

beforeAll(async () => {
  await sequelize.sync({ force: true });

  const hashedPassword = await bcrypt.hash("admin123", 10);

  await User.create({
    nama: "Admin Test",
    email: "admin@test.com",
    password: hashedPassword,
    role: "admin",
  });

  const loginResponse = await request(app).post("/api/auth/login").send({
    email: "admin@test.com",
    password: "admin123",
  });

  adminToken = loginResponse.body.token;
});

afterAll(async () => {
  await sequelize.close();
});

describe("Regression Test Suite - CRUD Turnamen GameHub", () => {
  test("GET /api/tournaments - berhasil mengambil semua turnamen", async () => {
    const response = await request(app).get("/api/tournaments");

    expect(response.statusCode).toBe(200);
  });

  test("GET /api/tournaments - response harus berupa array", async () => {
    const response = await request(app).get("/api/tournaments");

    expect(Array.isArray(response.body)).toBe(true);
  });

  test("POST /api/tournaments - admin berhasil membuat turnamen baru", async () => {
    const response = await request(app)
      .post("/api/tournaments")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        nama: "ML Championship Test",
        game: "mobile_legends",
        format: "5v5",
        max_tim: 8,
        slot_tersisa: 8,
        tanggal_mulai: "2026-07-01",
        tanggal_selesai: "2026-07-02",
        status: "open",
        deskripsi: "Turnamen untuk pengujian regression test",
      });

    expect([200, 201]).toContain(response.statusCode);

    const tournament = await Tournament.findOne({
      where: { nama: "ML Championship Test" },
    });

    expect(tournament).not.toBeNull();
    tournamentId = tournament.id;
  });

  test("POST /api/tournaments - gagal membuat turnamen tanpa token", async () => {
    const response = await request(app).post("/api/tournaments").send({
      nama: "Turnamen Tanpa Token",
      game: "mobile_legends",
      format: "5v5",
      max_tim: 8,
      tanggal_mulai: "2026-07-01",
      status: "open",
      deskripsi: "Seharusnya gagal karena tidak ada token",
    });

    expect([401, 403]).toContain(response.statusCode);
  });

  test("POST /api/tournaments - gagal jika data wajib tidak lengkap", async () => {
    const response = await request(app)
      .post("/api/tournaments")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        nama: "",
        game: "mobile_legends",
        format: "5v5",
        max_tim: 8,
        tanggal_mulai: "2026-07-01",
      });

    expect(response.statusCode).toBe(400);
  });

  test("GET /api/tournaments/:id - berhasil mengambil detail turnamen", async () => {
    const response = await request(app).get(`/api/tournaments/${tournamentId}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("id", tournamentId);
    expect(response.body).toHaveProperty("nama");
  });

  test("GET /api/tournaments/:id - gagal jika ID tidak ditemukan", async () => {
    const response = await request(app).get("/api/tournaments/99999");

    expect(response.statusCode).toBe(404);
  });

  test("PUT /api/tournaments/:id - admin berhasil update turnamen", async () => {
    const response = await request(app)
      .put(`/api/tournaments/${tournamentId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        nama: "ML Championship Updated",
        game: "mobile_legends",
        format: "5v5",
        max_tim: 16,
        slot_tersisa: 16,
        tanggal_mulai: "2026-08-01",
        tanggal_selesai: "2026-08-02",
        status: "open",
        deskripsi: "Turnamen sudah diperbarui",
      });

    expect(response.statusCode).toBe(200);

    const updatedTournament = await Tournament.findByPk(tournamentId);
    expect(updatedTournament.nama).toBe("ML Championship Updated");
  });

  test("PUT /api/tournaments/:id - gagal update jika ID tidak ditemukan", async () => {
    const response = await request(app)
      .put("/api/tournaments/99999")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        nama: "Turnamen Tidak Ada",
        game: "mobile_legends",
        format: "5v5",
        max_tim: 8,
        tanggal_mulai: "2026-08-01",
        status: "open",
      });

    expect(response.statusCode).toBe(404);
  });

  test("DELETE /api/tournaments/:id - admin berhasil hapus turnamen", async () => {
    const response = await request(app)
      .delete(`/api/tournaments/${tournamentId}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(response.statusCode).toBe(200);

    const deletedTournament = await Tournament.findByPk(tournamentId);
    expect(deletedTournament).toBeNull();
  });

  test("DELETE /api/tournaments/:id - gagal hapus jika ID tidak ditemukan", async () => {
    const response = await request(app)
      .delete("/api/tournaments/99999")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(response.statusCode).toBe(404);
  });
});
