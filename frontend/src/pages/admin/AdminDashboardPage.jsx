import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import useAuthStore from "../../store/useAuthStore";

function AdminDashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const [stats, setStats] = useState({
    turnamenAktif: 0,
    totalTim: 0,
    matchSelesai: 0,
    pendingPendaftaran: 0,
  });

  const [pendaftaranMasuk, setPendaftaranMasuk] = useState([]);
  const [turnamen, setTurnamen] = useState([]);
  const [loading, setLoading] = useState(true);

  const menuAdmin = [
    ["📊", "Dashboard", "/admin/dashboard"],
    ["🏆", "Kelola Turnamen", "/admin/turnamen"],
    ["👥", "Kelola Peserta", "/admin/peserta"],
    ["⚔️", "Kelola Bracket & Match", "/admin/match"],
    ["📈", "Statistik", "/admin/statistik"],
    ["👤", "Manajemen User", "/admin/users"],
  ];

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await api.get("/admin/dashboard");

      setStats(res.data.stats);
      setPendaftaranMasuk(res.data.pendaftaranMasuk);
      setTurnamen(res.data.turnamen);
    } catch (err) {
      console.log("Gagal mengambil dashboard admin:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatusTim = async (teamId, status) => {
    try {
      await api.put(`/admin/teams/${teamId}/status`, { status });
      fetchDashboard();
    } catch (err) {
      alert("Gagal mengubah status tim.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    useAuthStore.setState({
      user: null,
      token: null,
      isAuthenticated: false,
    });

    navigate("/", { replace: true });
  };

  return (
    <div className="min-h-screen bg-[#060E18] text-white flex">
      {/* SIDEBAR ADMIN */}
      <aside className="w-64 bg-[#0F1E2D] border-r border-blue-900/40 flex flex-col">
        <div className="px-6 py-6 border-b border-blue-900/40">
          <div className="font-bold text-lg tracking-widest">
            GAME<span className="text-cyan-400">HUB</span>
          </div>
        </div>

        <div className="px-6 py-5 border-b border-blue-900/40 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center font-bold">
            {user?.nama?.[0] || "A"}
          </div>

          <div>
            <div className="font-bold text-sm">{user?.nama || "Admin"}</div>
            <div className="text-xs text-gray-400">Super Administrator</div>
          </div>
        </div>

        <div className="px-4 pt-5">
          <div className="text-xs text-gray-500 px-2 mb-3 tracking-widest">
            PENGELOLAAN
          </div>

          <div className="flex flex-col gap-1 text-sm">
            {menuAdmin.map(([ico, label, path]) => (
              <Link
                key={label}
                to={path}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition ${
                  path === "/admin/dashboard"
                    ? "bg-blue-600 text-white"
                    : "text-gray-300 hover:bg-white/5 hover:text-white"
                }`}
              >
                <span className="w-5">{ico}</span>
                <span>{label}</span>
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-auto px-4 py-5 border-t border-blue-900/40">
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
      <main className="flex-1 p-8">
        <h1 className="text-2xl font-bold mb-1">
          Dashboard <span className="text-cyan-400">Admin</span>
        </h1>

        <p className="text-gray-400 text-sm mb-8">
          Pantau dan kelola semua turnamen GameHub
        </p>

        {loading ? (
          <div className="text-gray-400 text-sm">Memuat dashboard admin...</div>
        ) : (
          <>
            {/* CARD STATISTIK */}
            <div className="grid grid-cols-4 gap-4 mb-8">
              {[
                ["🏆", "Turnamen Aktif", stats.turnamenAktif],
                ["👥", "Total Tim", stats.totalTim],
                ["⚔️", "Match Selesai", stats.matchSelesai],
                ["📝", "Pending Pendaftaran", stats.pendingPendaftaran],
              ].map(([ico, label, value]) => (
                <div
                  key={label}
                  className="bg-[#0F1E2D] border border-blue-900/40 rounded-2xl p-5"
                >
                  <div className="text-xl mb-3">{ico}</div>
                  <div className="text-2xl font-bold">{value}</div>
                  <div className="text-xs text-gray-400 mt-1">{label}</div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-6">
              {/* PENDAFTARAN MASUK */}
              <div className="bg-[#0F1E2D] border border-blue-900/40 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="font-bold">Pendaftaran Masuk</h2>

                  <span className="text-xs bg-orange-500/20 text-orange-400 px-2 py-1 rounded-full">
                    {stats.pendingPendaftaran} Baru
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-gray-400 border-b border-blue-900/40">
                        <th className="text-left py-3">Tim</th>
                        <th className="text-left py-3">Turnamen</th>
                        <th className="text-left py-3">Aksi</th>
                      </tr>
                    </thead>

                    <tbody>
                      {pendaftaranMasuk.length === 0 ? (
                        <tr>
                          <td
                            colSpan="3"
                            className="text-center text-gray-500 py-10"
                          >
                            Belum ada pendaftaran masuk.
                          </td>
                        </tr>
                      ) : (
                        pendaftaranMasuk.map((team) => (
                          <tr
                            key={team.id}
                            className="border-b border-blue-900/20"
                          >
                            <td className="py-3">
                              <div className="font-semibold text-white">
                                {team.nama_tim}
                              </div>
                              <div className="text-xs text-gray-500">
                                {team.user?.nama || "User"}
                              </div>
                            </td>

                            <td className="py-3">
                              <div>{team.tournament?.nama || "-"}</div>
                              <div className="text-xs text-gray-500">
                                {team.tournament?.game || "-"}
                              </div>
                            </td>

                            <td className="py-3">
                              <div className="flex gap-2">
                                <button
                                  onClick={() =>
                                    updateStatusTim(team.id, "terkonfirmasi")
                                  }
                                  className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded-lg text-xs font-semibold"
                                >
                                  OK
                                </button>

                                <button
                                  onClick={() =>
                                    updateStatusTim(team.id, "ditolak")
                                  }
                                  className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded-lg text-xs font-semibold"
                                >
                                  Tolak
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* KELOLA TURNAMEN */}
              <div className="bg-[#0F1E2D] border border-blue-900/40 rounded-2xl p-6">
                <h2 className="font-bold mb-5">Kelola Turnamen</h2>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-gray-400 border-b border-blue-900/40">
                        <th className="text-left py-3">Turnamen</th>
                        <th className="text-left py-3">Status</th>
                        <th className="text-left py-3">Aksi</th>
                      </tr>
                    </thead>

                    <tbody>
                      {turnamen.length === 0 ? (
                        <tr>
                          <td
                            colSpan="3"
                            className="text-center text-gray-500 py-10"
                          >
                            Belum ada turnamen.
                          </td>
                        </tr>
                      ) : (
                        turnamen.map((item) => (
                          <tr
                            key={item.id}
                            className="border-b border-blue-900/20"
                          >
                            <td className="py-3">
                              <div className="font-semibold text-white">
                                {item.nama}
                              </div>
                              <div className="text-xs text-gray-500">
                                {item.game}
                              </div>
                            </td>

                            <td className="py-3">
                              <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full">
                                {item.status}
                              </span>
                            </td>

                            <td className="py-3">
                              <Link
                                to="/admin/turnamen"
                                className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded-lg text-xs font-semibold"
                              >
                                Edit
                              </Link>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default AdminDashboardPage;
