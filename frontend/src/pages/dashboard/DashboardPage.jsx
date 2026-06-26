import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import useAuthStore from "../../store/useAuthStore";

function DashboardPage() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    api
      .get("/teams/my")
      .then((res) => setTeams(res.data))
      .catch(() => {});
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
                  label === "Dashboard"
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
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">
              Halo,{" "}
              <span className="text-cyan-400">
                {user?.nama?.split(" ")[0] || "Pemain"}
              </span>{" "}
              👋
            </h1>

            <p className="text-[var(--text-muted)] text-sm mt-1">
              Semangat bertanding!
            </p>
          </div>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {[
            ["🏆", "Turnamen Diikuti", teams.length],
            [
              "👥",
              "Tim Aktif",
              teams.filter((t) => t.status === "terkonfirmasi").length,
            ],
            ["⚔️", "Match Dimainkan", "0"],
            ["🏅", "Kemenangan", "0"],
          ].map(([ico, label, val]) => (
            <div
              key={label}
              className="bg-[var(--bg-card)] border border-[var(--border-main)] rounded-2xl p-4"
            >
              <div className="text-xl mb-2">{ico}</div>
              <div className="text-3xl font-bold">{val}</div>
              <div className="text-xs text-[var(--text-muted)] mt-1">
                {label}
              </div>
            </div>
          ))}
        </div>

        {/* TIM SAYA */}
        <div className="bg-[var(--bg-card)] border border-[var(--border-main)] rounded-2xl p-5">
          <h2 className="font-bold text-base mb-4">Status Tim</h2>

          {teams.length === 0 ? (
            <div className="text-[var(--text-muted)] text-sm text-center py-8">
              Kamu belum mendaftarkan tim ke turnamen manapun.
              <br />
              <Link
                to="/turnamen"
                className="text-blue-400 hover:underline mt-2 inline-block"
              >
                Cari Turnamen →
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {teams.map((team) => (
                <div
                  key={team.id}
                  className={`p-3 rounded-xl border ${
                    team.status === "terkonfirmasi"
                      ? "bg-green-500/5 border-green-500/20"
                      : team.status === "ditolak"
                        ? "bg-red-500/5 border-red-500/20"
                        : "bg-orange-500/5 border-orange-500/20"
                  }`}
                >
                  <div className="font-semibold text-sm">{team.nama_tim}</div>

                  <div className="text-xs text-[var(--text-muted)] mt-1">
                    {team.tournament?.nama}
                  </div>

                  <span
                    className={`text-xs font-bold mt-2 inline-block px-2 py-0.5 rounded-full ${
                      team.status === "terkonfirmasi"
                        ? "bg-green-500/20 text-green-400"
                        : team.status === "ditolak"
                          ? "bg-red-500/20 text-red-400"
                          : "bg-orange-500/20 text-orange-400"
                    }`}
                  >
                    {team.status === "terkonfirmasi"
                      ? "✓ Terkonfirmasi"
                      : team.status === "ditolak"
                        ? "✗ Ditolak"
                        : "⏳ Pending"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default DashboardPage;
