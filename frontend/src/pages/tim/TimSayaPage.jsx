import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import useAuthStore from "../../store/useAuthStore";

function TimSayaPage() {
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
    fetchTimSaya();
  }, []);

  const fetchTimSaya = async () => {
    try {
      const res = await api.get("/teams/my");
      setTeams(res.data);
    } catch (err) {
      console.log("Gagal mengambil data tim:", err);
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

  const totalTim = teams.length;
  const totalPending = teams.filter((team) => team.status === "pending").length;
  const totalTerkonfirmasi = teams.filter(
    (team) => team.status === "terkonfirmasi",
  ).length;
  const totalDitolak = teams.filter((team) => team.status === "ditolak").length;

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
                  path === "/tim-saya"
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
          Tim <span className="text-cyan-400">Saya</span>
        </h1>

        <p className="text-[var(--text-muted)] text-sm mb-6">
          Lihat semua tim yang kamu daftarkan ke turnamen GameHub
        </p>

        {/* STATISTIK */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {[
            ["👥", "Total Tim", totalTim],
            ["⏳", "Pending", totalPending],
            ["✅", "Terkonfirmasi", totalTerkonfirmasi],
            ["❌", "Ditolak", totalDitolak],
          ].map(([icon, label, value]) => (
            <div
              key={label}
              className="bg-[var(--bg-card)] border border-[var(--border-main)] rounded-2xl p-5"
            >
              <div className="text-xl mb-2">{icon}</div>
              <div className="text-3xl font-bold">{value}</div>
              <div className="text-xs text-[var(--text-muted)] mt-1">
                {label}
              </div>
            </div>
          ))}
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

        {/* DAFTAR TIM */}
        <div className="bg-[var(--bg-card)] border border-[var(--border-main)] rounded-2xl p-6">
          <h2 className="font-bold mb-5">Daftar Tim Saya</h2>

          {loading ? (
            <div className="text-center text-[var(--text-muted)] py-10">
              Memuat data tim...
            </div>
          ) : filteredTeams.length === 0 ? (
            <div className="text-center text-[var(--text-muted)] py-10">
              Kamu belum memiliki tim pada kategori ini.
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
                      <h3 className="font-bold text-xl">{team.nama_tim}</h3>

                      <div className="text-sm text-[var(--text-muted)] mt-1">
                        {team.tournament?.nama || "Turnamen"} •{" "}
                        {getGameLabel(team.tournament?.game)}
                      </div>

                      <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <div className="text-xs text-[var(--text-muted)] mb-1">
                            Turnamen
                          </div>
                          <div className="font-semibold">
                            {team.tournament?.nama || "-"}
                          </div>
                        </div>

                        <div>
                          <div className="text-xs text-[var(--text-muted)] mb-1">
                            Format
                          </div>
                          <div className="font-semibold">
                            {team.tournament?.format || "-"}
                          </div>
                        </div>

                        <div>
                          <div className="text-xs text-[var(--text-muted)] mb-1">
                            Tanggal Mulai
                          </div>
                          <div className="font-semibold">
                            {team.tournament?.tanggal_mulai || "-"}
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

                  {/* ANGGOTA TIM */}
                  <div className="mt-5 border-t border-[var(--border-main)] pt-4">
                    <div className="text-xs text-[var(--text-muted)] mb-3 font-semibold tracking-wider">
                      ANGGOTA TIM
                    </div>

                    {team.members && team.members.length > 0 ? (
                      <div className="grid grid-cols-2 gap-2">
                        {team.members.map((member, index) => (
                          <div
                            key={member.id || index}
                            className="bg-white/5 border border-[var(--border-main)] rounded-xl px-3 py-2 text-sm"
                          >
                            <span className="text-[var(--text-muted)] mr-2">
                              {index + 1}.
                            </span>
                            {member.nama_pemain || member.nama || "-"}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-sm text-[var(--text-muted)]">
                        Belum ada data anggota.
                      </div>
                    )}
                  </div>

                  {/* INFO STATUS */}
                  <div className="mt-5 border-t border-[var(--border-main)] pt-4">
                    {team.status === "pending" && (
                      <div className="text-sm text-orange-300">
                        Tim kamu sedang menunggu konfirmasi admin.
                      </div>
                    )}

                    {team.status === "terkonfirmasi" && (
                      <div className="text-sm text-green-300">
                        Tim kamu sudah dikonfirmasi dan bisa masuk ke bracket
                        pertandingan.
                      </div>
                    )}

                    {team.status === "ditolak" && (
                      <div className="text-sm text-red-300">
                        Pendaftaran tim kamu ditolak oleh admin.
                      </div>
                    )}
                  </div>

                  {/* TOMBOL */}
                  <div className="mt-4 flex gap-3">
                    <Link
                      to={`/turnamen/${team.tournament?.id}`}
                      className="inline-block px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-xl text-sm font-semibold transition text-white"
                    >
                      Lihat Detail Turnamen
                    </Link>

                    <Link
                      to="/jadwal"
                      className="inline-block px-4 py-2 border border-[var(--border-main)] hover:border-blue-500 rounded-xl text-sm font-semibold transition"
                    >
                      Lihat Jadwal
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default TimSayaPage;
