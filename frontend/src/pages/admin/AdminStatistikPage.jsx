import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import useAuthStore from "../../store/useAuthStore";

function AdminStatistikPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const [stats, setStats] = useState({
    totalTurnamen: 0,
    totalTim: 0,
    totalUser: 0,
    totalMatchSelesai: 0,
    pendingPendaftaran: 0,
  });

  const menuAdmin = [
    ["📊", "Dashboard", "/admin/dashboard"],
    ["🏆", "Kelola Turnamen", "/admin/turnamen"],
    ["👥", "Kelola Peserta", "/admin/peserta"],
    ["⚔️", "Kelola bracket & Match", "/admin/match"],
    ["📈", "Statistik", "/admin/statistik"],
    ["👤", "Manajemen User", "/admin/users"],
  ];

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await api.get("/admin/statistik");
      setStats(res.data);
    } catch (err) {
      console.log("Endpoint /admin/statistik belum tersedia");
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

  const cards = [
    ["🏆", "Total Turnamen", stats.totalTurnamen],
    ["👥", "Total Tim", stats.totalTim],
    ["👤", "Total User", stats.totalUser],
    ["⚔️", "Match Selesai", stats.totalMatchSelesai],
    ["📝", "Pending Pendaftaran", stats.pendingPendaftaran],
  ];

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
                  path === "/admin/statistik"
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
          Statistik <span className="text-cyan-400">GameHub</span>
        </h1>

        <p className="text-gray-400 text-sm mb-8">
          Pantau perkembangan turnamen, peserta, user, dan match
        </p>

        <div className="grid grid-cols-5 gap-4 mb-8">
          {cards.map(([ico, label, value]) => (
            <div
              key={label}
              className="bg-[#0F1E2D] border border-blue-900/40 rounded-2xl p-5"
            >
              <div className="text-xl mb-3">{ico}</div>
              <div className="text-3xl font-bold">{value}</div>
              <div className="text-xs text-gray-400 mt-1">{label}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="bg-[#0F1E2D] border border-blue-900/40 rounded-2xl p-6">
            <h2 className="font-bold mb-4">Ringkasan Aktivitas</h2>

            <div className="flex flex-col gap-3 text-sm text-gray-300">
              <div className="flex justify-between border-b border-blue-900/30 pb-3">
                <span>Total Turnamen</span>
                <span className="text-cyan-400 font-bold">
                  {stats.totalTurnamen}
                </span>
              </div>

              <div className="flex justify-between border-b border-blue-900/30 pb-3">
                <span>Total Tim Terdaftar</span>
                <span className="text-cyan-400 font-bold">
                  {stats.totalTim}
                </span>
              </div>

              <div className="flex justify-between border-b border-blue-900/30 pb-3">
                <span>Total User</span>
                <span className="text-cyan-400 font-bold">
                  {stats.totalUser}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Pendaftaran Pending</span>
                <span className="text-orange-400 font-bold">
                  {stats.pendingPendaftaran}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-[#0F1E2D] border border-blue-900/40 rounded-2xl p-6">
            <h2 className="font-bold mb-4">Keterangan</h2>

            <p className="text-sm text-gray-400 leading-relaxed">
              Data statistik ini digunakan admin untuk memantau perkembangan
              turnamen, jumlah tim, jumlah user, serta match yang sudah selesai.
              Nantinya data ini akan otomatis mengikuti perubahan dari database.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default AdminStatistikPage;
