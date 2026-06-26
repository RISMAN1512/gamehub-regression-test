import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import useAuthStore from "../../store/useAuthStore";

function AdminPesertaPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const [teams, setTeams] = useState([]);
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
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      const res = await api.get("/admin/teams");
      setTeams(res.data);
    } catch (err) {
      console.log("Endpoint /admin/teams belum tersedia atau gagal diambil");
      setTeams([]);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (teamId, status) => {
    try {
      await api.put(`/admin/teams/${teamId}/status`, { status });
      fetchTeams();
    } catch (err) {
      alert("Gagal mengubah status tim. Pastikan API backend sudah dibuat.");
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
    if (status === "terkonfirmasi") return "Terkonfirmasi";
    if (status === "ditolak") return "Ditolak";
    return "Pending";
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
                  path === "/admin/peserta"
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
          Kelola <span className="text-cyan-400">Peserta</span>
        </h1>

        <p className="text-gray-400 text-sm mb-8">
          Kelola tim yang mendaftar ke turnamen GameHub
        </p>

        <div className="bg-[#0F1E2D] border border-blue-900/40 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold">Pendaftaran Tim</h2>

            <span className="text-xs bg-orange-500/20 text-orange-400 px-3 py-1 rounded-full">
              {teams.filter((team) => team.status === "pending").length} Pending
            </span>
          </div>

          {loading ? (
            <div className="text-center text-gray-400 py-10">
              Memuat data peserta...
            </div>
          ) : teams.length === 0 ? (
            <div className="text-center text-gray-500 py-10">
              Belum ada tim yang mendaftar.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-gray-400 border-b border-blue-900/40">
                    <th className="text-left py-3">Tim</th>
                    <th className="text-left py-3">Turnamen</th>
                    <th className="text-left py-3">Game</th>
                    <th className="text-left py-3">Status</th>
                    <th className="text-left py-3">Aksi</th>
                  </tr>
                </thead>

                <tbody>
                  {teams.map((team) => (
                    <tr
                      key={team.id}
                      className="border-b border-blue-900/20 text-gray-300"
                    >
                      <td className="py-4">
                        <div className="font-semibold text-white">
                          {team.nama_tim}
                        </div>
                        <div className="text-xs text-gray-500">
                          Ketua: {team.user?.nama || "-"}
                        </div>
                      </td>

                      <td className="py-4">
                        {team.tournament?.nama || "Turnamen"}
                      </td>

                      <td className="py-4">{team.tournament?.game || "-"}</td>

                      <td className="py-4">
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${getStatusStyle(
                            team.status,
                          )}`}
                        >
                          {getStatusText(team.status)}
                        </span>
                      </td>

                      <td className="py-4">
                        {team.status === "pending" ? (
                          <div className="flex gap-2">
                            <button
                              onClick={() =>
                                updateStatus(team.id, "terkonfirmasi")
                              }
                              className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded-lg text-xs font-semibold"
                            >
                              OK
                            </button>

                            <button
                              onClick={() => updateStatus(team.id, "ditolak")}
                              className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded-lg text-xs font-semibold"
                            >
                              Tolak
                            </button>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-500">
                            Sudah diproses
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default AdminPesertaPage;
