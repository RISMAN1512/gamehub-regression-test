import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import useAuthStore from "../../store/useAuthStore";

function AdminMatchPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const [tournaments, setTournaments] = useState([]);
  const [selectedTournament, setSelectedTournament] = useState("");
  const [selectedTournamentData, setSelectedTournamentData] = useState(null);
  const [matches, setMatches] = useState([]);
  const [teams, setTeams] = useState([]);

  const [loading, setLoading] = useState(false);
  const [savingManual, setSavingManual] = useState(false);
  const [msg, setMsg] = useState("");

  const [manualForm, setManualForm] = useState({
    babak: "babak_16",
    ronde: 1,
    urutan: 1,
    team1_id: "",
    team2_id: "",
    jadwal: "",
  });

  const menuAdmin = [
    ["📊", "Dashboard", "/admin/dashboard"],
    ["🏆", "Kelola Turnamen", "/admin/turnamen"],
    ["👥", "Kelola Peserta", "/admin/peserta"],
    ["⚔️", "Kelola Bracket & Match", "/admin/match"],
    ["📈", "Statistik", "/admin/statistik"],
    ["👤", "Manajemen User", "/admin/users"],
  ];

  const babakOptions = [
    { value: "babak_16", label: "Babak 16 Besar", ronde: 1 },
    { value: "perempat_final", label: "Perempat Final", ronde: 2 },
    { value: "semi_final", label: "Semi Final", ronde: 3 },
    { value: "final", label: "Final", ronde: 4 },
  ];

  const getBabakLabel = (ronde) => {
    if (Number(ronde) === 1) return "Babak 16 Besar";
    if (Number(ronde) === 2) return "Perempat Final";
    if (Number(ronde) === 3) return "Semi Final";
    if (Number(ronde) === 4) return "Final";
    return `Ronde ${ronde}`;
  };

  useEffect(() => {
    fetchTournaments();
  }, []);

  const fetchTournaments = async () => {
    try {
      const res = await api.get("/tournaments");
      setTournaments(res.data);
    } catch (err) {
      setTournaments([]);
    }
  };

  const fetchMatches = async (tournamentId) => {
    setSelectedTournament(tournamentId);
    setMsg("");

    if (!tournamentId) {
      setMatches([]);
      setTeams([]);
      setSelectedTournamentData(null);
      return;
    }

    setLoading(true);

    try {
      const tournament = tournaments.find(
        (item) => String(item.id) === String(tournamentId),
      );

      setSelectedTournamentData(tournament || null);

      const [matchRes, teamRes] = await Promise.all([
        api.get(`/matches/bracket/${tournamentId}`),
        api.get(`/teams/tournament/${tournamentId}`),
      ]);

      setMatches(matchRes.data);
      setTeams(teamRes.data);
    } catch (err) {
      setMatches([]);
      setTeams([]);
      setMsg("Gagal mengambil data match atau peserta.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateManualMatch = async (e) => {
    e.preventDefault();
    setMsg("");

    if (!selectedTournament) {
      setMsg("Pilih turnamen terlebih dahulu.");
      return;
    }

    if (!manualForm.team1_id || !manualForm.team2_id) {
      setMsg("Pilih Team 1 dan Team 2 terlebih dahulu.");
      return;
    }

    if (manualForm.team1_id === manualForm.team2_id) {
      setMsg("Team 1 dan Team 2 tidak boleh sama.");
      return;
    }

    setSavingManual(true);

    try {
      await api.post("/matches/manual", {
        tournament_id: Number(selectedTournament),
        ronde: Number(manualForm.ronde),
        urutan: Number(manualForm.urutan),
        team1_id: Number(manualForm.team1_id),
        team2_id: Number(manualForm.team2_id),
        jadwal: manualForm.jadwal || null,
      });

      setMsg("Match manual berhasil dibuat.");

      setManualForm({
        babak: "babak_16",
        ronde: 1,
        urutan: 1,
        team1_id: "",
        team2_id: "",
        jadwal: "",
      });

      await fetchMatches(selectedTournament);
    } catch (err) {
      setMsg(err.response?.data?.message || "Gagal membuat match manual.");
    } finally {
      setSavingManual(false);
    }
  };

  const updateScore = async (matchId, skorTeam1, skorTeam2, pemenangId) => {
    if (skorTeam1 === "" || skorTeam2 === "" || !pemenangId) {
      alert("Skor dan pemenang wajib diisi.");
      return;
    }

    try {
      await api.put(`/matches/${matchId}/hasil`, {
        skor_team1: Number(skorTeam1),
        skor_team2: Number(skorTeam2),
        pemenang_id: Number(pemenangId),
      });

      await fetchMatches(selectedTournament);
      alert("Hasil match berhasil disimpan.");
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Gagal menyimpan hasil match. Pastikan data sudah benar.",
      );
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

  const confirmedTeams = teams.filter(
    (team) => team.status === "terkonfirmasi",
  );

  const pendingTeams = teams.filter((team) => team.status === "pending");

  const getGameLabel = (game) => {
    if (game === "mobile_legends") return "Mobile Legends";
    if (game === "pubg_mobile") return "PUBG Mobile";
    if (game === "efootball") return "eFootball";
    return game || "-";
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
                  path === "/admin/match"
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
          Kelola Bracket <span className="text-cyan-400">& Match</span>
        </h1>

        <p className="text-gray-400 text-sm mb-8">
          Buat bagan pertandingan secara manual, input skor, dan tentukan
          pemenang.
        </p>

        {msg && (
          <div className="bg-blue-500/10 border border-blue-500/30 text-blue-300 text-sm px-4 py-3 rounded-xl mb-6">
            {msg}
          </div>
        )}

        {/* PILIH TURNAMEN */}
        <div className="bg-[#0F1E2D] border border-blue-900/40 rounded-2xl p-6 mb-6">
          <label className="text-xs text-gray-400 font-semibold tracking-wider">
            PILIH TURNAMEN
          </label>

          <select
            value={selectedTournament}
            onChange={(e) => fetchMatches(e.target.value)}
            className="w-full mt-2 bg-white/5 border border-blue-900/40 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-blue-500"
          >
            <option value="" className="text-black">
              Pilih turnamen
            </option>

            {tournaments.map((tournament) => (
              <option
                key={tournament.id}
                value={tournament.id}
                className="text-black"
              >
                {tournament.nama}
              </option>
            ))}
          </select>
        </div>

        {/* INFORMASI TURNAMEN */}
        {selectedTournament && (
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="bg-[#0F1E2D] border border-blue-900/40 rounded-2xl p-5">
              <div className="text-xl mb-2">🏆</div>
              <div className="text-lg font-bold">
                {selectedTournamentData?.nama || "-"}
              </div>
              <div className="text-xs text-gray-400 mt-1">Turnamen</div>
            </div>

            <div className="bg-[#0F1E2D] border border-blue-900/40 rounded-2xl p-5">
              <div className="text-xl mb-2">🎮</div>
              <div className="text-lg font-bold">
                {getGameLabel(selectedTournamentData?.game)}
              </div>
              <div className="text-xs text-gray-400 mt-1">Game</div>
            </div>

            <div className="bg-[#0F1E2D] border border-blue-900/40 rounded-2xl p-5">
              <div className="text-xl mb-2">👥</div>
              <div className="text-lg font-bold">
                {confirmedTeams.length} Tim
              </div>
              <div className="text-xs text-gray-400 mt-1">
                Tim Terkonfirmasi
              </div>
            </div>

            <div className="bg-[#0F1E2D] border border-blue-900/40 rounded-2xl p-5">
              <div className="text-xl mb-2">📝</div>
              <div className="text-lg font-bold">{pendingTeams.length} Tim</div>
              <div className="text-xs text-gray-400 mt-1">
                Pending Konfirmasi
              </div>
            </div>
          </div>
        )}

        {/* BUAT MATCH MANUAL */}
        {selectedTournament && (
          <div className="bg-[#0F1E2D] border border-blue-900/40 rounded-2xl p-6 mb-6">
            <h2 className="font-bold mb-1">Buat Match Manual</h2>

            <p className="text-gray-400 text-sm mb-5">
              Pilih babak dan tim yang sudah terkonfirmasi untuk dibuatkan bagan
              pertandingan.
            </p>

            {confirmedTeams.length < 2 ? (
              <div className="bg-orange-500/10 border border-orange-500/20 text-orange-300 text-sm rounded-xl p-4">
                Minimal harus ada 2 tim terkonfirmasi untuk membuat match.
              </div>
            ) : (
              <form
                onSubmit={handleCreateManualMatch}
                className="grid grid-cols-2 gap-4"
              >
                <div>
                  <label className="text-xs text-gray-400 font-semibold tracking-wider">
                    PILIH BABAK
                  </label>

                  <select
                    value={manualForm.babak}
                    onChange={(e) => {
                      const selectedBabak = babakOptions.find(
                        (item) => item.value === e.target.value,
                      );

                      setManualForm({
                        ...manualForm,
                        babak: e.target.value,
                        ronde: selectedBabak?.ronde || 1,
                      });
                    }}
                    className="w-full mt-2 bg-white/5 border border-blue-900/40 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-blue-500"
                  >
                    {babakOptions.map((babak) => (
                      <option
                        key={babak.value}
                        value={babak.value}
                        className="text-black"
                      >
                        {babak.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs text-gray-400 font-semibold tracking-wider">
                    URUTAN MATCH
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={manualForm.urutan}
                    onChange={(e) =>
                      setManualForm({
                        ...manualForm,
                        urutan: e.target.value,
                      })
                    }
                    className="w-full mt-2 bg-white/5 border border-blue-900/40 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="text-xs text-gray-400 font-semibold tracking-wider">
                    TEAM 1
                  </label>
                  <select
                    value={manualForm.team1_id}
                    onChange={(e) =>
                      setManualForm({
                        ...manualForm,
                        team1_id: e.target.value,
                      })
                    }
                    className="w-full mt-2 bg-white/5 border border-blue-900/40 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-blue-500"
                  >
                    <option value="" className="text-black">
                      Pilih Team 1
                    </option>

                    {confirmedTeams.map((team) => (
                      <option
                        key={team.id}
                        value={team.id}
                        className="text-black"
                      >
                        {team.nama_tim}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs text-gray-400 font-semibold tracking-wider">
                    TEAM 2
                  </label>
                  <select
                    value={manualForm.team2_id}
                    onChange={(e) =>
                      setManualForm({
                        ...manualForm,
                        team2_id: e.target.value,
                      })
                    }
                    className="w-full mt-2 bg-white/5 border border-blue-900/40 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-blue-500"
                  >
                    <option value="" className="text-black">
                      Pilih Team 2
                    </option>

                    {confirmedTeams.map((team) => (
                      <option
                        key={team.id}
                        value={team.id}
                        className="text-black"
                      >
                        {team.nama_tim}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-span-2">
                  <label className="text-xs text-gray-400 font-semibold tracking-wider">
                    JADWAL MATCH
                  </label>
                  <input
                    type="datetime-local"
                    value={manualForm.jadwal}
                    onChange={(e) =>
                      setManualForm({
                        ...manualForm,
                        jadwal: e.target.value,
                      })
                    }
                    className="w-full mt-2 bg-white/5 border border-blue-900/40 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-blue-500"
                  />
                </div>

                <div className="col-span-2 flex justify-end">
                  <button
                    type="submit"
                    disabled={savingManual}
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-700 rounded-xl text-sm font-semibold disabled:opacity-60"
                  >
                    {savingManual ? "Menyimpan..." : "Simpan Match Manual"}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* DAFTAR MATCH */}
        <div className="bg-[#0F1E2D] border border-blue-900/40 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold">Daftar Match</h2>

            {matches.length > 0 && (
              <span className="text-xs bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full">
                {matches.length} Match
              </span>
            )}
          </div>

          {loading ? (
            <div className="text-center text-gray-400 py-10">
              Memuat match...
            </div>
          ) : !selectedTournament ? (
            <div className="text-center text-gray-500 py-10">
              Pilih turnamen terlebih dahulu.
            </div>
          ) : matches.length === 0 ? (
            <div className="text-center text-gray-500 py-10">
              Belum ada match untuk turnamen ini.
              <br />
              <span className="text-gray-600 text-xs">
                Buat match manual dari tim yang sudah terkonfirmasi.
              </span>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {matches.map((match) => (
                <MatchCard
                  key={match.id}
                  match={match}
                  onSave={updateScore}
                  getBabakLabel={getBabakLabel}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function MatchCard({ match, onSave, getBabakLabel }) {
  const [skor1, setSkor1] = useState(match.skor_team1 ?? "");
  const [skor2, setSkor2] = useState(match.skor_team2 ?? "");
  const [pemenang, setPemenang] = useState(match.pemenang_id || "");

  const isSelesai = match.status === "selesai";

  return (
    <div className="bg-[#102033] border border-blue-900/30 rounded-xl p-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="font-semibold text-sm">
            {getBabakLabel(match.ronde)} - Match #{match.urutan}
          </div>

          <div className="text-xs text-gray-400 mt-1">
            Input skor pertandingan dan pilih pemenang
          </div>
        </div>

        <span
          className={`text-xs px-2 py-1 rounded-full ${
            isSelesai
              ? "bg-green-500/20 text-green-400"
              : "bg-orange-500/20 text-orange-400"
          }`}
        >
          {isSelesai ? "Selesai" : "Menunggu"}
        </span>
      </div>

      <div className="grid grid-cols-[1fr_80px_40px_80px_1fr] gap-3 items-center">
        <div className="bg-white/5 border border-blue-900/30 rounded-xl px-3 py-2 text-sm">
          {match.team1?.nama_tim || "TBD"}
        </div>

        <input
          type="number"
          value={skor1}
          onChange={(e) => setSkor1(e.target.value)}
          placeholder="0"
          min="0"
          className="bg-white/5 border border-blue-900/30 rounded-xl px-3 py-2 text-sm text-center outline-none focus:border-blue-500"
        />

        <div className="text-center text-gray-500 font-bold">VS</div>

        <input
          type="number"
          value={skor2}
          onChange={(e) => setSkor2(e.target.value)}
          placeholder="0"
          min="0"
          className="bg-white/5 border border-blue-900/30 rounded-xl px-3 py-2 text-sm text-center outline-none focus:border-blue-500"
        />

        <div className="bg-white/5 border border-blue-900/30 rounded-xl px-3 py-2 text-sm">
          {match.team2?.nama_tim || "TBD"}
        </div>
      </div>

      <div className="flex gap-3 mt-4">
        <select
          value={pemenang}
          onChange={(e) => setPemenang(e.target.value)}
          className="flex-1 bg-white/5 border border-blue-900/30 rounded-xl px-3 py-2 text-sm outline-none focus:border-blue-500"
        >
          <option value="" className="text-black">
            Pilih pemenang
          </option>

          {match.team1 && (
            <option value={match.team1.id} className="text-black">
              {match.team1.nama_tim}
            </option>
          )}

          {match.team2 && (
            <option value={match.team2.id} className="text-black">
              {match.team2.nama_tim}
            </option>
          )}
        </select>

        <button
          onClick={() => onSave(match.id, skor1, skor2, pemenang)}
          className="px-5 py-2 bg-blue-600 hover:bg-blue-700 rounded-xl text-sm font-semibold"
        >
          Simpan Hasil
        </button>
      </div>
    </div>
  );
}

export default AdminMatchPage;
