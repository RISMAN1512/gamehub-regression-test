import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import useAuthStore from "../../store/useAuthStore";

function TournamentDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();

  const [tournament, setTournament] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({ nama_tim: "", anggota: "" });

  useEffect(() => {
    api
      .get(`/tournaments/${id}`)
      .then((res) => {
        setTournament(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    useAuthStore.setState({ token: null, user: null, isAuthenticated: false });
    navigate("/", { replace: true });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      await api.post("/teams/register", {
        tournament_id: id,
        nama_tim: formData.nama_tim,
        anggota: formData.anggota,
      });
      setSuccess(true);
      setTimeout(() => navigate("/jadwal"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Gagal mendaftar tim.");
    } finally {
      setSubmitting(false);
    }
  };

  const gameLabel = {
    mobile_legends: "Mobile Legends",
    pubg_mobile: "PUBG Mobile",
    efootball: "eFootball",
  };

  const menuUtama = [
    ["Dashboard", "/dashboard"],
    ["Turnamen", "/turnamen"],
    ["Tim Saya", "/tim-saya"],
    ["Jadwal", "/jadwal"],
    ["Riwayat", "/riwayat"],
  ];

  const menuAkun = [
    ["Profil", "/profil"],
    ["Pengaturan", "/pengaturan"],
  ];

  if (loading)
    return (
      <div className="min-h-screen bg-[#060E18] text-white flex items-center justify-center">
        Memuat...
      </div>
    );

  if (!tournament)
    return (
      <div className="min-h-screen bg-[#060E18] text-white flex items-center justify-center">
        Turnamen tidak ditemukan.
      </div>
    );

  return (
    <div className="min-h-screen bg-[#060E18] text-white flex">
      {isAuthenticated && (
        <aside className="w-56 bg-[#0F1E2D] border-r border-blue-900/40 flex flex-col">
          <div className="font-bold text-lg tracking-widest px-5 py-6 border-b border-blue-900/40">
            GAME<span className="text-cyan-400">HUB</span>
          </div>
          <div className="px-4 pt-5">
            <div className="text-xs text-gray-500 px-2 mb-3 tracking-widest">
              MENU UTAMA
            </div>
            <div className="flex flex-col gap-1 text-sm">
              {menuUtama.map(([label, path]) => (
                <Link
                  key={label}
                  to={path}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg transition ${
                    path === "/turnamen"
                      ? "bg-blue-600 text-white"
                      : "text-gray-400 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>
          <div className="px-4 pt-6">
            <div className="text-xs text-gray-500 px-2 mb-3 tracking-widest">
              AKUN
            </div>
            <div className="flex flex-col gap-1 text-sm">
              {menuAkun.map(([label, path]) => (
                <Link
                  key={label}
                  to={path}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-400 hover:bg-white/5 hover:text-white transition"
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>
          <div className="mt-auto px-4 py-5 border-t border-blue-900/40">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-red-400 hover:bg-red-500/10 w-full text-sm transition"
            >
              Keluar
            </button>
          </div>
        </aside>
      )}

      <main className="flex-1 p-8">
        <Link
          to="/turnamen"
          className="text-blue-400 text-sm hover:underline mb-6 inline-block"
        >
          &larr; Kembali ke Turnamen
        </Link>

        <div className="bg-[#0F1E2D] border border-blue-900/40 rounded-2xl p-6 mb-6">
          <h1 className="text-2xl font-bold mb-2">{tournament.nama}</h1>
          <div className="flex gap-4 text-sm text-gray-400 mb-4">
            <span>🎮 {gameLabel[tournament.game] || tournament.game}</span>
            <span>📅 {tournament.tanggal_mulai}</span>
            <span>👥 {tournament.format}</span>
            <span
              className={`font-bold ${tournament.status === "open" ? "text-green-400" : "text-red-400"}`}
            >
              {tournament.status === "open" ? "OPEN" : "PENUH"}
            </span>
          </div>
          <div className="text-sm text-gray-400">
            Slot tersisa:{" "}
            <span className="text-white font-bold">
              {tournament.slot_tersisa}
            </span>{" "}
            dari {tournament.max_tim} tim
          </div>
        </div>

        {isAuthenticated ? (
          tournament.status === "open" ? (
            success ? (
              <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-6 text-center">
                <div className="text-4xl mb-3">✅</div>
                <h2 className="text-xl font-bold text-green-400 mb-2">
                  Pendaftaran Berhasil!
                </h2>
                <p className="text-gray-400">
                  Tim kamu sudah terdaftar. Menunggu konfirmasi admin.
                </p>
                <p className="text-gray-500 text-sm mt-2">
                  Mengalihkan ke halaman jadwal...
                </p>
              </div>
            ) : (
              <div className="bg-[#0F1E2D] border border-blue-900/40 rounded-2xl p-6">
                <h2 className="text-xl font-bold mb-5">Daftar Tim</h2>
                {error && (
                  <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl px-4 py-3 mb-4 text-sm">
                    {error}
                  </div>
                )}
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <div>
                    <label className="text-sm text-gray-400 mb-1 block">
                      Nama Tim
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.nama_tim}
                      onChange={(e) =>
                        setFormData({ ...formData, nama_tim: e.target.value })
                      }
                      placeholder="Masukkan nama tim kamu"
                      className="w-full bg-white/5 border border-blue-900/40 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 mb-1 block">
                      Anggota Tim
                    </label>
                    <textarea
                      value={formData.anggota}
                      onChange={(e) =>
                        setFormData({ ...formData, anggota: e.target.value })
                      }
                      placeholder="Nama anggota tim (pisahkan dengan koma)"
                      rows={3}
                      className="w-full bg-white/5 border border-blue-900/40 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 resize-none"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition"
                  >
                    {submitting ? "Mendaftarkan..." : "Daftar Sekarang"}
                  </button>
                </form>
              </div>
            )
          ) : (
            <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6 text-center text-red-400">
              Turnamen ini sudah penuh atau ditutup.
            </div>
          )
        ) : (
          <div className="bg-[#0F1E2D] border border-blue-900/40 rounded-2xl p-6 text-center">
            <p className="text-gray-400 mb-4">
              Login untuk mendaftar ke turnamen ini.
            </p>
            <Link
              to="/login"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl text-sm font-semibold transition"
            >
              Login Sekarang
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}

export default TournamentDetailPage;
