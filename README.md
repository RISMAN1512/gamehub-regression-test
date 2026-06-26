# GameHub Regression Test Suite

## Deskripsi Project

GameHub adalah aplikasi turnamen game berbasis web yang memiliki fitur pengguna dan admin. Pengguna dapat mendaftar turnamen, membuat tim, melihat jadwal, dan melihat bracket pertandingan. Admin dapat mengelola turnamen, mengonfirmasi peserta, membuat bracket, dan menginput hasil match.

Tugas ini berfokus pada implementasi Regression Test Suite untuk REST API CRUD menggunakan Jest dan Supertest.

## Fitur yang Diuji

Fitur utama yang diuji adalah CRUD Turnamen pada backend GameHub.

Endpoint yang diuji:

- GET /api/tournaments
- GET /api/tournaments/:id
- POST /api/tournaments
- PUT /api/tournaments/:id
- DELETE /api/tournaments/:id

Selain itu, pengujian juga mencakup login admin untuk mendapatkan token autentikasi.

## Tools yang Digunakan

- Node.js
- Express.js
- MySQL
- Sequelize
- Jest
- Supertest
- Postman
- GitHub Actions

## Daftar Test Case

1. Login admin berhasil
2. Login gagal jika password salah
3. GET semua turnamen berhasil
4. GET semua turnamen menghasilkan array
5. POST turnamen berhasil oleh admin
6. POST turnamen gagal tanpa token
7. POST turnamen gagal jika data wajib tidak lengkap
8. GET detail turnamen berhasil
9. GET detail turnamen gagal jika ID tidak ditemukan
10. PUT turnamen berhasil oleh admin
11. PUT turnamen gagal jika ID tidak ditemukan
12. DELETE turnamen berhasil oleh admin
13. DELETE turnamen gagal jika ID tidak ditemukan

Total test yang dijalankan: 21 test.

## Cara Menjalankan Project Backend

Masuk ke folder backend:

```bash
cd backend
```

Install dependency:

```bash
npm install
```

Jalankan backend:

```bash
npm run dev
```
