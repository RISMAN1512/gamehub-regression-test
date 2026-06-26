// ============================================================
// UNIT TEST – Modul Autentikasi (Auth)
// Nama   : Muhammad Waliyul Sunan
// NIM    : 231011090
// Modul  : Auth (Register & Login)
// ============================================================

const request = require("supertest");
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Setup express app mini untuk testing
const app = express();
app.use(express.json());

// Mock database agar tidak perlu koneksi MySQL saat testing
jest.mock("../models", () => {
  const mockUser = {
    id: 1,
    nama: "Waliyul Test",
    email: "waliyul@test.com",
    password: "$2a$10$hashedpassword",
    role: "pemain",
    nim: "231011090",
  };

  return {
    User: {
      findOne: jest.fn(),
      create: jest.fn(),
      findByPk: jest.fn(),
      update: jest.fn(),
    },
    Tournament: { findAll: jest.fn(), findByPk: jest.fn() },
    Team: { findAll: jest.fn() },
    TeamMember: {},
    Match: {},
    sequelize: { authenticate: jest.fn(), sync: jest.fn() },
  };
});

// Import controller setelah mock
const authController = require("../controllers/authController");

// Setup routes untuk test
app.post("/api/auth/register", authController.register);
app.post("/api/auth/login", authController.login);

const { User } = require("../models");

// ── Sebelum semua test, reset mock ──────────────────────────
beforeEach(() => {
  jest.clearAllMocks();
});

// ============================================================
// TEST SUITE 1: REGISTER
// ============================================================
describe("Auth – Register", () => {
  test("✅ TC-001: Register berhasil dengan data valid", async () => {
    // Setup mock
    User.findOne.mockResolvedValue(null); // email belum ada
    User.create.mockResolvedValue({
      id: 1,
      nama: "Waliyul Test",
      email: "waliyul@test.com",
      role: "pemain",
    });

    const res = await request(app).post("/api/auth/register").send({
      nama: "Waliyul Test",
      email: "waliyul@test.com",
      password: "password123",
      nim: "231011090",
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe("Registrasi berhasil!");
    expect(res.body.user).toHaveProperty("email", "waliyul@test.com");
  });

  test("❌ TC-002: Register gagal jika email sudah terdaftar", async () => {
    // Email sudah ada di database
    User.findOne.mockResolvedValue({
      id: 1,
      email: "waliyul@test.com",
    });

    const res = await request(app).post("/api/auth/register").send({
      nama: "Waliyul Test",
      email: "waliyul@test.com",
      password: "password123",
    });

    expect(res.statusCode).toBe(409);
    expect(res.body.message).toBe("Email sudah terdaftar.");
  });

  test("❌ TC-003: Register gagal jika nama kosong", async () => {
    const res = await request(app).post("/api/auth/register").send({
      nama: "",
      email: "waliyul@test.com",
      password: "password123",
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Nama, email, dan password wajib diisi.");
  });

  test("❌ TC-004: Register gagal jika email kosong", async () => {
    const res = await request(app).post("/api/auth/register").send({
      nama: "Waliyul Test",
      email: "",
      password: "password123",
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Nama, email, dan password wajib diisi.");
  });

  test("❌ TC-005: Register gagal jika password kosong", async () => {
    const res = await request(app).post("/api/auth/register").send({
      nama: "Waliyul Test",
      email: "waliyul@test.com",
      password: "",
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Nama, email, dan password wajib diisi.");
  });
});

// ============================================================
// TEST SUITE 2: LOGIN
// ============================================================
describe("Auth – Login", () => {
  test("✅ TC-006: Login berhasil dengan kredensial valid", async () => {
    const hashedPw = await bcrypt.hash("password123", 10);
    User.findOne.mockResolvedValue({
      id: 1,
      nama: "Waliyul Test",
      email: "waliyul@test.com",
      password: hashedPw,
      role: "pemain",
      nim: "231011090",
    });

    process.env.JWT_SECRET = "gamehub_secret_key_2025";
    process.env.JWT_EXPIRES = "7d";

    const res = await request(app).post("/api/auth/login").send({
      email: "waliyul@test.com",
      password: "password123",
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Login berhasil!");
    expect(res.body).toHaveProperty("token");
    expect(res.body.user).toHaveProperty("email", "waliyul@test.com");
  });

  test("❌ TC-007: Login gagal jika email tidak ditemukan", async () => {
    User.findOne.mockResolvedValue(null);

    const res = await request(app).post("/api/auth/login").send({
      email: "tidakada@test.com",
      password: "password123",
    });

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe("Email tidak ditemukan.");
  });

  test("❌ TC-008: Login gagal jika password salah", async () => {
    const hashedPw = await bcrypt.hash("password123", 10);
    User.findOne.mockResolvedValue({
      id: 1,
      email: "waliyul@test.com",
      password: hashedPw,
      role: "pemain",
    });

    const res = await request(app).post("/api/auth/login").send({
      email: "waliyul@test.com",
      password: "passwordsalah",
    });

    expect(res.statusCode).toBe(401);
    expect(res.body.message).toBe("Password salah.");
  });

  test("❌ TC-009: Login gagal jika email kosong", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "",
      password: "password123",
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Email dan password wajib diisi.");
  });

  test("❌ TC-010: Login gagal jika password kosong", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "waliyul@test.com",
      password: "",
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Email dan password wajib diisi.");
  });
});
