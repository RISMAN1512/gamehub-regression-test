import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import useAuthStore from "../../store/useAuthStore";

function ProfilePage() {
  const { user, updateUser } = useAuthStore();
  const navigate = useNavigate();

  const [tab, setTab] = useState("info");

  const [form, setForm] = useState({
    nama: user?.nama || "",
    nim: user?.nim || "",
    email: user?.email || "",
    game_favorit: user?.game_favorit || "",
    bio: user?.bio || "",
  });

  const [pwForm, setPwForm] = useState({
    password_lama: "",
    password_baru: "",
    konfirmasi: "",
  });

  const [msg, setMsg] = useState("");

  const saveProfile = async () => {
    try {
      await api.put("/auth/profile", form);
      updateUser({ ...user, ...form });
      setMsg("Profil berhasil disimpan!");
    } catch {
      setMsg("Gagal menyimpan.");
    }
  };

  const savePassword = async () => {
    if (pwForm.password_baru !== pwForm.konfirmasi) {
      setMsg("Password tidak cocok!");
      return;
    }

    try {
      await api.put("/auth/password", {
        password_lama: pwForm.password_lama,
        password_baru: pwForm.password_baru,
      });

      setMsg("Password berhasil diperbarui!");
      setPwForm({
        password_lama: "",
        password_baru: "",
        konfirmasi: "",
      });
    } catch (err) {
      setMsg(err.response?.data?.message || "Gagal.");
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
                  label === "Profil"
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
          Profil <span className="text-cyan-400">Pengguna</span>
        </h1>

        <p className="text-[var(--text-muted)] text-sm mb-6">
          Kelola informasi akun dan keamanan kamu
        </p>

        {msg && (
          <div className="bg-green-500/10 border border-green-500/30 text-green-400 text-sm px-4 py-3 rounded-xl mb-4">
            {msg}
          </div>
        )}

        {/* TABS */}
        <div className="flex gap-2 bg-white/5 rounded-xl p-1 w-fit mb-6">
          {[
            ["info", "Informasi Akun"],
            ["keamanan", "Keamanan"],
          ].map(([key, label]) => (
            <button
              key={key}
              onClick={() => {
                setTab(key);
                setMsg("");
              }}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                tab === key
                  ? "bg-blue-600 text-white"
                  : "text-[var(--text-muted)] hover:text-[var(--text-main)]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* TAB INFORMASI AKUN */}
        {tab === "info" && (
          <div className="grid grid-cols-[220px_1fr] gap-5">
            <div className="bg-[var(--bg-card)] border border-[var(--border-main)] rounded-2xl p-5 text-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-3xl font-bold mx-auto mb-3 text-white">
                {user?.nama?.[0] || "U"}
              </div>

              <div className="font-bold">{user?.nama || "Pengguna"}</div>

              <div className="text-xs text-[var(--text-muted)] mt-1">
                {user?.nim || "-"}
              </div>

              <span className="text-xs bg-blue-500/20 text-blue-400 border border-blue-500/30 px-3 py-1 rounded-full mt-3 inline-block">
                🎮 Pemain Aktif
              </span>
            </div>

            <div className="bg-[var(--bg-card)] border border-[var(--border-main)] rounded-2xl p-6">
              <h3 className="font-bold text-base mb-1">Edit Informasi Akun</h3>

              <p className="text-[var(--text-muted)] text-xs mb-5 pb-4 border-b border-[var(--border-main)]">
                Perbarui data diri kamu di bawah ini
              </p>

              <div className="flex flex-col gap-4">
                {[
                  ["NAMA LENGKAP", "nama", "text"],
                  ["EMAIL", "email", "email"],
                  ["GAME FAVORIT", "game_favorit", "text"],
                ].map(([label, key, type]) => (
                  <div key={key}>
                    <label className="text-xs text-[var(--text-muted)] font-semibold tracking-wider">
                      {label}
                    </label>

                    <input
                      type={type}
                      value={form[key]}
                      onChange={(e) =>
                        setForm({ ...form, [key]: e.target.value })
                      }
                      className="w-full mt-2 bg-white/5 border border-[var(--border-main)] rounded-xl px-4 py-2.5 text-sm text-[var(--text-main)] outline-none focus:border-blue-500"
                    />
                  </div>
                ))}

                <div>
                  <label className="text-xs text-[var(--text-muted)] font-semibold tracking-wider">
                    BIO SINGKAT
                  </label>

                  <textarea
                    value={form.bio}
                    onChange={(e) => setForm({ ...form, bio: e.target.value })}
                    rows={2}
                    className="w-full mt-2 bg-white/5 border border-[var(--border-main)] rounded-xl px-4 py-2.5 text-sm text-[var(--text-main)] outline-none focus:border-blue-500 resize-none"
                  />
                </div>

                <div className="flex gap-3 mt-2">
                  <button
                    onClick={saveProfile}
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-700 rounded-xl text-sm font-semibold transition text-white"
                  >
                    💾 Simpan
                  </button>

                  <button className="px-5 py-2 border border-[var(--border-main)] rounded-xl text-sm hover:border-blue-500 transition">
                    Batalkan
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB KEAMANAN */}
        {tab === "keamanan" && (
          <div className="max-w-lg">
            <div className="bg-[var(--bg-card)] border border-[var(--border-main)] rounded-2xl p-6">
              <h3 className="font-bold mb-1">Ubah Password</h3>

              <p className="text-xs text-[var(--text-muted)] mb-5 pb-4 border-b border-[var(--border-main)]">
                Minimal 8 karakter dengan kombinasi huruf dan angka
              </p>

              <div className="flex flex-col gap-4">
                {[
                  ["PASSWORD SAAT INI", "password_lama"],
                  ["PASSWORD BARU", "password_baru"],
                  ["KONFIRMASI PASSWORD BARU", "konfirmasi"],
                ].map(([label, key]) => (
                  <div key={key}>
                    <label className="text-xs text-[var(--text-muted)] font-semibold tracking-wider">
                      {label}
                    </label>

                    <input
                      type="password"
                      value={pwForm[key]}
                      onChange={(e) =>
                        setPwForm({ ...pwForm, [key]: e.target.value })
                      }
                      className="w-full mt-2 bg-white/5 border border-[var(--border-main)] rounded-xl px-4 py-2.5 text-sm text-[var(--text-main)] outline-none focus:border-blue-500"
                    />
                  </div>
                ))}

                <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-3 text-xs text-blue-300">
                  💡 <strong>Tips:</strong> Min. 8 karakter + huruf besar, huruf
                  kecil, angka, dan simbol.
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={savePassword}
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-700 rounded-xl text-sm font-semibold transition text-white"
                  >
                    🔐 Perbarui Password
                  </button>

                  <button className="px-5 py-2 border border-[var(--border-main)] rounded-xl text-sm hover:border-blue-500 transition">
                    Batalkan
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default ProfilePage;
