import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import useAuthStore from "../../store/useAuthStore";

function RiwayatPage() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("Semua");
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/teams/my")
      .then((res) => {
        setTeams(res.data);
        setLoading(false);
      })
      .catch(() => {
        setTeams([]);
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

  const filterGame = ["Semua", "Mobile Legends", "PUBG Mobile", "eFootball"];

  const getGameLabel = (game) => {
    if (game === "mobile_legends") return "Mobile Legends";
    if (game === "pubg_mobile") return "PUBG Mobile";
    if (game === "efootball") return "eFootball";
    return game || "-";
  };

  const dataTampil =
    filter === "Semua"
      ? teams
      : teams.filter((team) => getGameLabel(team.tournament?.game) === filter);

  const getStatusStyle = (status) => {
    if (status === "terkonfirmasi") {
      return "bg-green-500/20 text-green-400";
    }

    if (status === "ditolak") {
      return "bg-red-500/20 text-red-400";
    }

    return "bg-orange-500/20 text-orange-400";
  };

  const getStatusText = (status) => {
    if (status === "terkonfirmasi") {
      return "Terkonfirmasi";
    }

    if (status === "ditolak") {
      return "Ditolak";
    }

    return "Pending Konfirmasi";
  };

  const getGameIcon = (game) => {
    if (game === "mobile_legends") return "🏆";
    if (game === "pubg_mobile") return "🎯";
    if (game === "efootball") return "⚽";
    return "🎮";
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
                  path === "/riwayat"
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

      {/* MAIN CONTENT */}
      <main className="flex-1 p-7">
        <h1 className="text-2xl font-bold mb-1">
          Riwayat <span className="text-cyan-400">Pengguna</span>
        </h1>

        <p className="text-[var(--text-muted)] text-sm mb-8">
          Lihat riwayat turnamen yang pernah atau sedang kamu ikuti
        </p>

        <div className="max-w-5xl bg-[var(--bg-card)] border border-[var(--border-main)] rounded-2xl p-6">
          <h2 className="font-bold text-base mb-4">Riwayat Turnamen</h2>

          {/* FILTER */}
          <div className="flex gap-2 mb-5">
            {filterGame.map((item) => (
              <button
                key={item}
                onClick={() => setFilter(item)}
                className={`px-3 py-1 rounded-lg text-xs border transition ${
                  filter === item
                    ? "bg-blue-600 text-white border-blue-500"
                    : "bg-[var(--bg-card-soft)] text-[var(--text-muted)] border-[var(--border-main)] hover:bg-blue-600/20"
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          {/* LOADING */}
          {loading && (
            <div className="text-center text-[var(--text-muted)] text-sm py-10">
              Memuat riwayat turnamen...
            </div>
          )}

          {/* DATA KOSONG */}
          {!loading && dataTampil.length === 0 && (
            <div className="text-center text-[var(--text-muted)] text-sm py-10">
              Belum ada riwayat turnamen.
              <br />
              <Link
                to="/turnamen"
                className="text-blue-400 hover:underline mt-2 inline-block"
              >
                Daftar turnamen sekarang →
              </Link>
            </div>
          )}

          {/* LIST RIWAYAT */}
          {!loading && dataTampil.length > 0 && (
            <div className="flex flex-col gap-4">
              {dataTampil.map((team) => (
                <div
                  key={team.id}
                  className="bg-[var(--bg-card-soft)] border border-[var(--border-main)] rounded-xl p-4 flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-xl bg-[var(--bg-card)] border border-[var(--border-main)] flex items-center justify-center text-xl">
                      {getGameIcon(team.tournament?.game)}
                    </div>

                    <div>
                      <h3 className="font-semibold text-sm">
                        {team.tournament?.nama || "Nama Turnamen"}
                      </h3>

                      <p className="text-xs text-[var(--text-muted)] mt-1">
                        {getGameLabel(team.tournament?.game)} • Tim:{" "}
                        {team.nama_tim}
                      </p>

                      <span
                        className={`inline-block mt-2 text-xs px-2 py-1 rounded-full ${getStatusStyle(
                          team.status,
                        )}`}
                      >
                        {getStatusText(team.status)}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="font-bold text-sm text-cyan-400">
                      {team.status === "terkonfirmasi"
                        ? "Aktif"
                        : team.status === "ditolak"
                          ? "Ditolak"
                          : "Menunggu"}
                    </p>

                    <p className="text-xs text-[var(--text-muted)] mt-1">
                      Status pendaftaran
                    </p>
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

export default RiwayatPage;
