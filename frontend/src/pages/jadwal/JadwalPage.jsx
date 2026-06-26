import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import useAuthStore from "../../store/useAuthStore";

function JadwalPage() {
  const navigate = useNavigate();

  const [teams, setTeams] = useState([]);
  const [filter, setFilter] = useState("semua");
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    fetchJadwal();
  }, []);

  const fetchJadwal = async () => {
    try {
      const res = await api.get("/teams/my");
      setTeams(res.data);
    } catch (err) {
      console.log("Gagal mengambil jadwal:", err);
      setTeams([]);
    } finally {
      setLoading(false);
    }
  };

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

  const filteredTeams = teams.filter((team) => {
    if (filter === "semua") return true;
    return team.status === filter;
  });

  const totalJadwal = teams.length;
  const totalPending = teams.filter((team) => team.status === "pending").length;
  const totalTerkonfirmasi = teams.filter(
    (team) => team.status === "terkonfirmasi",
  ).length;

  const getStatusBadge = (status) => {
    if (status === "terkonfirmasi") {
      return "bg-green-500/20 text-green-400 border-green-500/30";
    }

    if (status === "ditolak") {
      return "bg-red-500/20 text-red-400 border-red-500/30";
    }

    return "bg-orange-500/20 text-orange-400 border-orange-500/30";
  };

  const getStatusText = (status) => {
    if (status === "terkonfirmasi") return "✓ Terkonfirmasi";
    if (status === "ditolak") return "✗ Ditolak";
    return "⏳ Pending";
  };

  const getGameLabel = (game) => {
    if (game === "mobile_legends") return "Mobile Legends";
    if (game === "pubg_mobile") return "PUBG Mobile";
    if (game === "efootball") return "eFootball";
    return game || "-";
  };

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] flex">
      {/* SIDEBAR */}
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
                  path === "/jadwal"
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

      {/* MAIN */}
      <main className="flex-1 p-7">
        <h1 className="text-2xl font-bold mb-1">
          Jadwal <span className="text-cyan-400">Pengguna</span>
        </h1>

        <p className="text-[var(--text-muted)] text-sm mb-6">
          Lihat jadwal turnamen dan status pertandingan tim kamu
        </p>

        {/* STATISTIK */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-[var(--bg-card)] border border-[var(--border-main)] rounded-2xl p-5">
            <div className="text-xl mb-2">📅</div>
            <div className="text-3xl font-bold">{totalJadwal}</div>
            <div className="text-xs text-[var(--text-muted)] mt-1">
              Total Jadwal
            </div>
          </div>

          <div className="bg-[var(--bg-card)] border border-[var(--border-main)] rounded-2xl p-5">
            <div className="text-xl mb-2">⏳</div>
            <div className="text-3xl font-bold">{totalPending}</div>
            <div className="text-xs text-[var(--text-muted)] mt-1">
              Menunggu Konfirmasi
            </div>
          </div>

          <div className="bg-[var(--bg-card)] border border-[var(--border-main)] rounded-2xl p-5">
            <div className="text-xl mb-2">✅</div>
            <div className="text-3xl font-bold">{totalTerkonfirmasi}</div>
            <div className="text-xs text-[var(--text-muted)] mt-1">
              Jadwal Aktif
            </div>
          </div>
        </div>

        {/* FILTER */}
        <div className="flex gap-2 bg-white/5 rounded-xl p-1 w-fit mb-6">
          {[
            ["semua", "Semua"],
            ["pending", "Pending"],
            ["terkonfirmasi", "Terkonfirmasi"],
            ["ditolak", "Ditolak"],
          ].map(([key, label]) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                filter === key
                  ? "bg-blue-600 text-white"
                  : "text-[var(--text-muted)] hover:text-[var(--text-main)]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* DAFTAR JADWAL */}
        <div className="bg-[var(--bg-card)] border border-[var(--border-main)] rounded-2xl p-6">
          <h2 className="font-bold mb-5">Daftar Jadwal Turnamen</h2>

          {loading ? (
            <div className="text-center text-[var(--text-muted)] py-10">
              Memuat jadwal...
            </div>
          ) : filteredTeams.length === 0 ? (
            <div className="text-center text-[var(--text-muted)] py-10">
              Belum ada jadwal turnamen.
              <br />
              <Link
                to="/turnamen"
                className="text-blue-400 hover:underline mt-2 inline-block"
              >
                Cari Turnamen →
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {filteredTeams.map((team) => (
                <div
                  key={team.id}
                  className="bg-[var(--bg-card-soft)] border border-[var(--border-main)] rounded-2xl p-5"
                >
                  <div className="flex items-start justify-between gap-5">
                    <div>
                      <h3 className="font-bold text-lg">
                        {team.tournament?.nama || "Turnamen"}
                      </h3>

                      <div className="text-sm text-[var(--text-muted)] mt-1">
                        {getGameLabel(team.tournament?.game)} •{" "}
                        {team.tournament?.tanggal_mulai || "Tanggal belum ada"}
                      </div>

                      <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="text-xs text-[var(--text-muted)] mb-1">
                            Nama Tim
                          </div>
                          <div className="font-semibold">{team.nama_tim}</div>
                        </div>

                        <div>
                          <div className="text-xs text-[var(--text-muted)] mb-1">
                            Format
                          </div>
                          <div className="font-semibold">
                            {team.tournament?.format || "-"}
                          </div>
                        </div>
                      </div>
                    </div>

                    <span
                      className={`text-xs font-bold border px-3 py-1 rounded-full ${getStatusBadge(
                        team.status,
                      )}`}
                    >
                      {getStatusText(team.status)}
                    </span>
                  </div>

                  <div className="mt-5 border-t border-[var(--border-main)] pt-4">
                    {team.status === "pending" && (
                      <div className="text-sm text-orange-300">
                        Jadwal pertandingan belum aktif. Tim kamu masih menunggu
                        konfirmasi admin.
                      </div>
                    )}

                    {team.status === "terkonfirmasi" && (
                      <div className="text-sm text-green-300">
                        Tim kamu sudah dikonfirmasi. Jadwal match akan muncul
                        setelah admin membuat bracket pertandingan.
                      </div>
                    )}

                    {team.status === "ditolak" && (
                      <div className="text-sm text-red-300">
                        Pendaftaran tim kamu ditolak. Tim ini tidak masuk ke
                        jadwal turnamen.
                      </div>
                    )}
                  </div>

                  {team.status === "terkonfirmasi" && (
                    <div className="mt-4">
                      <Link
                        to={`/turnamen/${team.tournament?.id}?from=jadwal`}
                        className="inline-block px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-xl text-sm font-semibold transition text-white"
                      >
                        Lihat Detail Turnamen
                      </Link>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default JadwalPage;
