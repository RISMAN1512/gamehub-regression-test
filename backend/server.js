const app = require("./app");
const sequelize = require("./config/database");

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("? Database terhubung!");
    await sequelize.sync({ alter: false });
    console.log("? Sinkronisasi database selesai!");
    app.listen(PORT, () => {
      console.log(`?? Server berjalan di port ${PORT}`);
    });
  } catch (err) {
    console.error("? Gagal terhubung ke database:", err.message);
    process.exit(1);
  }
};

startServer();
