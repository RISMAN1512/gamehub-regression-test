import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import useAuthStore from "../../store/useAuthStore";

function AdminTurnamenPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState(null);
  const [msg, setMsg] = useState("");

  const [form, setForm] = useState({
    nama: "",
    game: "mobile_legends",
    tanggal_mulai: "",
    format: "5v5",
    max_tim: 8,
    status: "open",
  });

  const menuAdmin = [
    ["📊", "Dashboard", "/admin/dashboard"],
    ["🏆", "Kelola Turnamen", "/admin/turnamen"],
    ["👥", "Kelola Peserta", "/admin/peserta"],
    ["⚔️", "Kelola Bracket & Match", "/admin/match"],
    ["📈", "Statistik", "/admin/statistik"],
    ["👤", "Manajemen User", "/admin/users"],
  ];

  useEffect(() => {
    fetchTournaments();
  }, []);

  const fetchTournaments = async () => {
    try {
      const res = await api.get("/tournaments");
      setTournaments(res.data);
    } catch (err) {
      console.log("Gagal mengambil data turnamen", err);
      setTournaments([]);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEditId(null);
    setForm({
      nama: "",
      game: "mobile_legends",
      tanggal_mulai: "",
      format: "5v5",
      max_tim: 8,
      status: "open",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");

    try {
      if (editId) {
        await api.put(`/tournaments/${editId}`, form);
        setMsg("Turnamen berhasil diperbarui.");
      } else {
        await api.post("/tournaments", {
          ...form,
          slot_tersisa: Number(form.max_tim),
        });
        setMsg("Turnamen berhasil ditambahkan.");
      }

      resetForm();
      fetchTournaments();
    } catch (err) {
      console.log(err);
      setMsg(
        err.response?.data?.message ||
          "Gagal menyimpan turnamen. Pastikan API backend sudah tersedia.",
      );
    }
  };

  const handleEdit = (tournament) => {
    setEditId(tournament.id);

    setForm({
      nama: tournament.nama || "",
      game: tournament.game || "mobile_legends",
      tanggal_mulai: tournament.tanggal_mulai || "",
      format: tournament.format || "5v5",
      max_tim: tournament.max_tim || 8,
      status: tournament.status || "open",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleStatusChange = async (id, status) => {
    try {
      await api.put(`/tournaments/${id}`, { status });
      fetchTournaments();
    } catch (err) {
      alert("Gagal mengubah status turnamen.");
    }
  };

  const handleDelete = async (id) => {
    const yakin = confirm("Yakin ingin menghapus turnamen ini?");

    if (!yakin) return;

    try {
      await api.delete(`/tournaments/${id}`);
      fetchTournaments();
    } catch (err) {
      alert("Gagal menghapus turnamen.");
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

  const gameLabel = {
    mobile_legends: "Mobile Legends",
    pubg_mobile: "PUBG Mobile",
    efootball: "eFootball",
  };

  const statusStyle = {
    open: "bg-green-500/20 text-green-400",
    penuh: "bg-red-500/20 text-red-400",
    selesai: "bg-gray-500/20 text-gray-400",
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
                  path === "/admin/turnamen"
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
          Kelola <span className="text-cyan-400">Turnamen</span>
        </h1>

        <p className="text-gray-400 text-sm mb-8">
          Tambah, edit, dan atur status turnamen yang tampil di halaman user.
        </p>

        {msg && (
          <div className="bg-blue-500/10 border border-blue-500/30 text-blue-300 text-sm px-4 py-3 rounded-xl mb-6">
            {msg}
          </div>
        )}

        {/* FORM TAMBAH / EDIT TURNAMEN */}
        <div className="bg-[#0F1E2D] border border-blue-900/40 rounded-2xl p-6 mb-8">
          <h2 className="font-bold mb-5">
            {editId ? "Edit Turnamen" : "Tambah Turnamen Baru"}
          </h2>

          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-5">
            <div>
              <label className="text-xs text-gray-400 font-semibold tracking-wider">
                NAMA TURNAMEN
              </label>

              <input
                type="text"
                value={form.nama}
                onChange={(e) => setForm({ ...form, nama: e.target.value })}
                placeholder="Contoh: ML Cup Season 3"
                className="w-full mt-2 bg-white/5 border border-blue-900/40 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="text-xs text-gray-400 font-semibold tracking-wider">
                GAME
              </label>

              <select
                value={form.game}
                onChange={(e) => setForm({ ...form, game: e.target.value })}
                className="w-full mt-2 bg-white/5 border border-blue-900/40 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-blue-500"
              >
                <option value="mobile_legends" className="text-black">
                  Mobile Legends
                </option>
                <option value="pubg_mobile" className="text-black">
                  PUBG Mobile
                </option>
                <option value="efootball" className="text-black">
                  eFootball
                </option>
              </select>
            </div>

            <div>
              <label className="text-xs text-gray-400 font-semibold tracking-wider">
                TANGGAL MULAI
              </label>

              <input
                type="date"
                value={form.tanggal_mulai}
                onChange={(e) =>
                  setForm({ ...form, tanggal_mulai: e.target.value })
                }
                className="w-full mt-2 bg-white/5 border border-blue-900/40 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="text-xs text-gray-400 font-semibold tracking-wider">
                FORMAT
              </label>

              <input
                type="text"
                value={form.format}
                onChange={(e) => setForm({ ...form, format: e.target.value })}
                placeholder="Contoh: 5v5, squad, 1v1"
                className="w-full mt-2 bg-white/5 border border-blue-900/40 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="text-xs text-gray-400 font-semibold tracking-wider">
                MAKSIMAL TIM
              </label>

              <input
                type="number"
                value={form.max_tim}
                onChange={(e) =>
                  setForm({ ...form, max_tim: Number(e.target.value) })
                }
                min="2"
                className="w-full mt-2 bg-white/5 border border-blue-900/40 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="text-xs text-gray-400 font-semibold tracking-wider">
                STATUS
              </label>

              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="w-full mt-2 bg-white/5 border border-blue-900/40 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-blue-500"
              >
                <option value="open" className="text-black">
                  Open
                </option>
                <option value="penuh" className="text-black">
                  Penuh
                </option>
                <option value="selesai" className="text-black">
                  Selesai
                </option>
              </select>
            </div>

            <div className="col-span-2 flex gap-3">
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-xl text-sm font-semibold transition"
              >
                {editId ? "💾 Simpan Perubahan" : "➕ Tambah Turnamen"}
              </button>

              {editId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-2 border border-gray-600 hover:border-blue-500 rounded-xl text-sm font-semibold transition"
                >
                  Batal Edit
                </button>
              )}
            </div>
          </form>
        </div>

        {/* DAFTAR TURNAMEN */}
        <div className="bg-[#0F1E2D] border border-blue-900/40 rounded-2xl p-6">
          <h2 className="font-bold mb-5">Daftar Turnamen</h2>

          {loading ? (
            <div className="text-center text-gray-400 py-10">
              Memuat data turnamen...
            </div>
          ) : tournaments.length === 0 ? (
            <div className="text-center text-gray-500 py-10">
              Belum ada turnamen. Tambahkan turnamen baru terlebih dahulu.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-gray-400 border-b border-blue-900/40">
                    <th className="text-left py-3">Turnamen</th>
                    <th className="text-left py-3">Game</th>
                    <th className="text-left py-3">Tanggal</th>
                    <th className="text-left py-3">Format</th>
                    <th className="text-left py-3">Slot</th>
                    <th className="text-left py-3">Status</th>
                    <th className="text-left py-3">Aksi</th>
                  </tr>
                </thead>

                <tbody>
                  {tournaments.map((tournament) => (
                    <tr
                      key={tournament.id}
                      className="border-b border-blue-900/20 text-gray-300"
                    >
                      <td className="py-4">
                        <div className="font-semibold text-white">
                          {tournament.nama}
                        </div>
                      </td>

                      <td className="py-4">
                        {gameLabel[tournament.game] || tournament.game}
                      </td>

                      <td className="py-4">{tournament.tanggal_mulai}</td>

                      <td className="py-4">{tournament.format}</td>

                      <td className="py-4">
                        {tournament.max_tim - tournament.slot_tersisa}/
                        {tournament.max_tim} Tim
                      </td>

                      <td className="py-4">
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            statusStyle[tournament.status] ||
                            "bg-gray-500/20 text-gray-400"
                          }`}
                        >
                          {tournament.status}
                        </span>
                      </td>

                      <td className="py-4">
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() => handleEdit(tournament)}
                            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded-lg text-xs font-semibold"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() =>
                              handleStatusChange(tournament.id, "open")
                            }
                            className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded-lg text-xs font-semibold"
                          >
                            Open
                          </button>

                          <button
                            onClick={() =>
                              handleStatusChange(tournament.id, "penuh")
                            }
                            className="px-3 py-1 bg-orange-600 hover:bg-orange-700 rounded-lg text-xs font-semibold"
                          >
                            Penuh
                          </button>

                          <button
                            onClick={() =>
                              handleStatusChange(tournament.id, "selesai")
                            }
                            className="px-3 py-1 bg-gray-600 hover:bg-gray-700 rounded-lg text-xs font-semibold"
                          >
                            Selesai
                          </button>

                          <button
                            onClick={() => handleDelete(tournament.id)}
                            className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded-lg text-xs font-semibold"
                          >
                            Hapus
                          </button>
                        </div>
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

export default AdminTurnamenPage;
