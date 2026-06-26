import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import useAuthStore from "../../store/useAuthStore";

function TournamentPage() {
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/tournaments")
      .then((res) => {
        setTournaments(res.data);
        setLoading(false);
      })
      .catch(() => {
        setTournaments([]);
        setLoading(false);
      });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    useAuthStore.setState({
      token: null,
      user: null,
      isAuthenticated: false,
    });

    navigate("/", { replace: true });
  };

  const menuUtama = [
    ["📊", "Dashboard", "/dashboard"],
    ["🏆", "Turnamen", "/turnamen"],
    ["👥", "Tim Saya", "/tim-saya"],
    ["📅", "Jadwal", "/jadwal"],
    ["📜", "Riwayat", "/riwayat"],
  ];

  const menuAkun = [
    ["👤", "Profil", "/profil"],
    ["⚙️", "Pengaturan", "/pengaturan"],
  ];

  const gameLabel = {
    mobile_legends: "MOBILE LEGENDS",
    pubg_mobile: "PUBG MOBILE",
    efootball: "eFOOTBALL",
  };

  const gameColor = {
    mobile_legends: "text-orange-400 bg-orange-400/10 border-orange-400/30",
    pubg_mobile: "text-yellow-400 bg-yellow-400/10 border-yellow-400/30",
    efootball: "text-green-400 bg-green-400/10 border-green-400/30",
  };

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)]">
      {/* NAVBAR PUBLIC - hanya muncul kalau belum login */}
      {!isAuthenticated && (
        <nav className="flex items-center justify-between px-10 py-4 border-b border-[var(--border-main)] bg-[var(--bg-sidebar)]">
          <Link to="/" className="font-bold text-2xl tracking-widest">
            GAME<span className="text-cyan-400">HUB</span>
          </Link>

          <div className="flex gap-3">
            <Link
              to="/login"
              className="px-4 py-2 border border-blue-600 rounded-lg text-sm"
            >
              Masuk
            </Link>

            <Link
              to="/register"
              className="px-4 py-2 bg-blue-600 rounded-lg text-sm text-white"
            >
              Daftar
            </Link>
          </div>
        </nav>
      )}

      <div className={isAuthenticated ? "flex min-h-screen" : ""}>
        {/* SIDEBAR - hanya muncul kalau sudah login */}
        {isAuthenticated && (
          <aside className="w-56 bg-[var(--bg-sidebar)] border-r border-[var(--border-main)] flex flex-col">
            <div className="font-bold text-lg tracking-widest px-5 py-6 border-b border-[var(--border-main)]">
              GAME<span className="text-cyan-400">HUB</span>
            </div>

            <div className="px-4 pt-5">
              <div className="text-xs text-[var(--text-muted)] px-2 mb-3 tracking-widest">
                MENU UTAMA
              </div>

              <div className="flex flex-col gap-1 text-sm">
                {menuUtama.map(([ico, label, path]) => (
                  <Link
                    key={label}
                    to={path}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg transition ${
                      path === "/turnamen"
                        ? "bg-blue-600 text-white"
                        : "text-[var(--text-muted)] hover:bg-white/5 hover:text-[var(--text-main)]"
                    }`}
                  >
                    <span className="w-5">{ico}</span>
                    <span>{label}</span>
                  </Link>
                ))}
              </div>
            </div>

            <div className="px-4 pt-6">
              <div className="text-xs text-[var(--text-muted)] px-2 mb-3 tracking-widest">
                AKUN
              </div>

              <div className="flex flex-col gap-1 text-sm">
                {menuAkun.map(([ico, label, path]) => (
                  <Link
                    key={label}
                    to={path}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-[var(--text-muted)] hover:bg-white/5 hover:text-[var(--text-main)] transition"
                  >
                    <span className="w-5">{ico}</span>
                    <span>{label}</span>
                  </Link>
                ))}
              </div>
            </div>

            <div className="mt-auto px-4 py-5 border-t border-[var(--border-main)]">
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-red-400 hover:bg-red-500/10 w-full text-sm transition"
              >
                <span className="w-5">↩</span>
                Keluar
              </button>
            </div>
          </aside>
        )}

        {/* MAIN CONTENT */}
        <main className="flex-1 px-10 py-10">
          <h1 className="text-3xl font-bold mb-2">
            Turnamen <span className="text-blue-400">Aktif</span>
          </h1>

          <p className="text-[var(--text-muted)] mb-8">
            Daftar sekarang sebelum slot penuh
          </p>

          {loading ? (
            <div className="text-center text-[var(--text-muted)] py-20">
              Memuat...
            </div>
          ) : tournaments.length === 0 ? (
            <div className="text-center text-[var(--text-muted)] py-20">
              Belum ada turnamen tersedia.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {tournaments.map((t) => (
                <div
                  key={t.id}
                  className="bg-[var(--bg-card)] border border-[var(--border-main)] rounded-2xl overflow-hidden hover:border-blue-500 transition"
                >
                  <div className="h-24 bg-gradient-to-br from-blue-500/10 to-purple-500/10 flex items-end p-3 relative">
                    <span
                      className={`text-xs font-bold px-2 py-1 rounded border ${
                        gameColor[t.game] ||
                        "text-blue-400 bg-blue-400/10 border-blue-400/30"
                      }`}
                    >
                      {gameLabel[t.game] || t.game}
                    </span>

                    <span
                      className={`absolute top-3 right-3 text-xs font-bold px-2 py-1 rounded-full ${
                        t.status === "open"
                          ? "bg-green-500/10 text-green-400 border border-green-400/30"
                          : "bg-red-500/10 text-red-400 border border-red-400/30"
                      }`}
                    >
                      {t.status === "open" ? "● OPEN" : "● PENUH"}
                    </span>
                  </div>

                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-2">{t.nama}</h3>

                    <div className="flex gap-4 text-xs text-[var(--text-muted)] mb-3">
                      <span>📅 {t.tanggal_mulai}</span>
                      <span>👥 {t.format}</span>
                    </div>

                    <div className="flex justify-between text-xs text-[var(--text-muted)] mb-1">
                      <span>Slot terisi</span>
                      <span
                        className={
                          t.slot_tersisa <= 4
                            ? "text-orange-400"
                            : "text-green-400"
                        }
                      >
                        {t.max_tim - t.slot_tersisa}/{t.max_tim} Tim
                      </span>
                    </div>

                    <div className="h-1 bg-white/10 rounded-full mb-4">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-blue-600 to-cyan-400"
                        style={{
                          width: `${
                            ((t.max_tim - t.slot_tersisa) / t.max_tim) * 100
                          }%`,
                        }}
                      />
                    </div>

                    <Link
                      to={`/turnamen/${t.id}`}
                      className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2 rounded-xl transition"
                    >
                      {t.status === "open" ? "Daftar Tim" : "Lihat Bracket"}
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default TournamentPage;
