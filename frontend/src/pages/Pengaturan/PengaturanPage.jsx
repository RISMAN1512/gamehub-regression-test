import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../../store/useAuthStore";
import useThemeStore from "../../store/useThemeStore";

function PengaturanPage() {
  const navigate = useNavigate();

  const { theme, toggleTheme } = useThemeStore();
  const isDark = theme === "dark";

  const [showProfile, setShowProfile] = useState(true);
  const [showHistory, setShowHistory] = useState(false);
  const [msg, setMsg] = useState("");

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

  const handleSave = () => {
    localStorage.setItem(
      "privacy_settings",
      JSON.stringify({
        showProfile,
        showHistory,
      }),
    );

    setMsg("Pengaturan berhasil disimpan!");
  };

  const menuUtama = [
    ["📊", "Dashboard", "/dashboard"],
    ["🏆", "Turnamen", "/turnamen"],
    ["👥", "Tim Saya", "/tim-saya"],
    ["🗓️", "Jadwal", "/jadwal"],
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
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-[var(--text-muted)] hover:bg-white/5 hover:text-[var(--text-main)] transition"
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
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition ${
                  path === "/pengaturan"
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
          Pengaturan <span className="text-cyan-400">Akun</span>
        </h1>

        <p className="text-[var(--text-muted)] text-sm mb-6">
          Atur preferensi tampilan dan privasi akun kamu
        </p>

        {msg && (
          <div className="bg-green-500/10 border border-green-500/30 text-green-400 text-sm px-4 py-3 rounded-xl mb-5">
            {msg}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* PREFERENSI TAMPILAN */}
          <div className="bg-[var(--bg-card)] border border-[var(--border-main)] rounded-2xl p-6">
            <h2 className="font-bold text-lg mb-1">Preferensi Tampilan</h2>

            <p className="text-[var(--text-muted)] text-sm mb-5">
              Atur tampilan aplikasi sesuai kenyamanan kamu.
            </p>

            <div className="flex items-center justify-between border-t border-[var(--border-main)] pt-5">
              <div>
                <h3 className="font-semibold text-sm">
                  {isDark ? "Mode Gelap" : "Mode Terang"}
                </h3>

                <p className="text-[var(--text-muted)] text-xs mt-1">
                  {isDark
                    ? "Saat ini aplikasi menggunakan tampilan gelap."
                    : "Saat ini aplikasi menggunakan tampilan terang."}
                </p>
              </div>

              <button
                onClick={toggleTheme}
                className={`w-14 h-7 rounded-full p-1 transition ${
                  isDark ? "bg-blue-600" : "bg-gray-400"
                }`}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full transition ${
                    isDark ? "translate-x-7" : "translate-x-0"
                  }`}
                ></div>
              </button>
            </div>
          </div>

          {/* PRIVASI */}
          <div className="bg-[var(--bg-card)] border border-[var(--border-main)] rounded-2xl p-6">
            <h2 className="font-bold text-lg mb-1">Privasi</h2>

            <p className="text-[var(--text-muted)] text-sm mb-5">
              Kelola informasi yang dapat dilihat oleh pengguna lain.
            </p>

            <div className="flex flex-col gap-5 border-t border-[var(--border-main)] pt-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-sm">
                    Tampilkan Profil Saya
                  </h3>

                  <p className="text-[var(--text-muted)] text-xs mt-1">
                    Profil kamu dapat dilihat oleh peserta lain.
                  </p>
                </div>

                <button
                  onClick={() => setShowProfile(!showProfile)}
                  className={`w-14 h-7 rounded-full p-1 transition ${
                    showProfile ? "bg-blue-600" : "bg-gray-400"
                  }`}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full transition ${
                      showProfile ? "translate-x-7" : "translate-x-0"
                    }`}
                  ></div>
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-sm">
                    Tampilkan Riwayat Turnamen
                  </h3>

                  <p className="text-[var(--text-muted)] text-xs mt-1">
                    Riwayat turnamen kamu dapat ditampilkan di profil.
                  </p>
                </div>

                <button
                  onClick={() => setShowHistory(!showHistory)}
                  className={`w-14 h-7 rounded-full p-1 transition ${
                    showHistory ? "bg-blue-600" : "bg-gray-400"
                  }`}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full transition ${
                      showHistory ? "translate-x-7" : "translate-x-0"
                    }`}
                  ></div>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* BUTTON SIMPAN */}
        <div className="mt-6">
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-xl text-sm font-semibold transition text-white"
          >
            💾 Simpan Pengaturan
          </button>
        </div>
      </main>
    </div>
  );
}

export default PengaturanPage;
