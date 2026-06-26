import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../../store/useAuthStore";

function AdminUsersPage() {
  const navigate = useNavigate();

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

  const menuAdmin = [
    ["📊", "Dashboard", "/admin/dashboard"],
    ["🏆", "Kelola Turnamen", "/admin/turnamen"],
    ["👥", "Kelola Peserta", "/admin/peserta"],
    ["⚔️", "Kelola Bracket & Match", "/admin/match"],
    ["📈", "Statistik", "/admin/statistik"],
    ["👤", "Manajemen User", "/admin/users"],
  ];

  return (
    <div className="min-h-screen bg-[#060E18] text-white flex">
      <aside className="w-64 bg-[#0F1E2D] border-r border-blue-900/40 flex flex-col">
        <div className="px-6 py-6 border-b border-blue-900/40 font-bold text-lg tracking-widest">
          GAME<span className="text-cyan-400">HUB</span>
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
                  path === "/admin/users"
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
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-red-400 hover:bg-red-500/10 w-full text-sm"
          >
            ↩ Keluar
          </button>
        </div>
      </aside>

      <main className="flex-1 p-8">
        <h1 className="text-2xl font-bold mb-1">
          Manajemen <span className="text-cyan-400">User</span>
        </h1>

        <p className="text-gray-400 text-sm mb-8">
          Kelola data pengguna dan role akun GameHub.
        </p>

        <div className="bg-[#0F1E2D] border border-blue-900/40 rounded-2xl p-6">
          <h2 className="font-bold mb-4">Daftar User</h2>

          <div className="text-gray-500 text-sm text-center py-10">
            Data user akan tampil otomatis dari database.
          </div>
        </div>
      </main>
    </div>
  );
}

export default AdminUsersPage;
