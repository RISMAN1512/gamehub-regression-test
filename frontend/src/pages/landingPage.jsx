import { Link } from "react-router-dom";

function LandingPage() {
  return (
    <div className="min-h-screen bg-[#060E18] text-white">
      {/* NAVBAR */}
      <nav className="flex items-center justify-between px-10 py-4 border-b border-blue-900">
        <div className="font-bold text-2xl tracking-widest">
          GAME<span className="text-cyan-400">HUB</span>
        </div>

        <div className="flex gap-8 text-gray-400 text-sm">
          <Link to="/" className="hover:text-white">
            Home
          </Link>
          <Link to="/turnamen" className="hover:text-white">
            Turnamen
          </Link>
          <a href="#tentang" className="hover:text-white">
            Tentang
          </a>
        </div>

        <div className="flex gap-3">
          <Link
            to="/login"
            className="px-4 py-2 border border-blue-600 rounded-lg text-sm hover:bg-blue-600 transition"
          >
            Masuk
          </Link>
          <Link
            to="/register"
            className="px-4 py-2 bg-blue-600 rounded-lg text-sm hover:bg-blue-700 transition"
          >
            Daftar
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <div className="flex flex-col items-center justify-center text-center py-32 px-4">
        <div className="text-xs bg-cyan-900/30 border border-cyan-500/30 text-cyan-400 px-4 py-1 rounded-full mb-8 tracking-widest">
          🎮 PLATFORM ESPORTS INDONESIA
        </div>

        <h1 className="text-6xl font-bold leading-tight mb-4">
          ARENA KOMPETISI
          <br />
          <span className="text-blue-400">ESPORTS TERBAIK</span>
        </h1>

        <p className="text-gray-400 text-lg mb-10 max-w-xl">
          Daftarkan tim kamu, ikuti turnamen Mobile Legends, PUBG Mobile, dan
          eFootball. Pantau bracket real-time dalam satu platform.
        </p>

        <div className="flex gap-4">
          <Link
            to="/turnamen"
            className="px-8 py-3 bg-blue-600 rounded-xl font-semibold hover:bg-blue-700 transition"
          >
            🏆 Lihat Turnamen
          </Link>
          <Link
            to="/register"
            className="px-8 py-3 border border-gray-600 rounded-xl font-semibold hover:border-blue-500 transition"
          >
            Daftar Gratis →
          </Link>
        </div>

        {/* Game chips */}
        <div className="flex gap-4 mt-10">
          <div className="bg-[#0F1E2D] border border-blue-900/40 rounded-xl px-5 py-2 flex items-center gap-2 text-sm">
            <div className="w-2 h-2 rounded-full bg-orange-400"></div> Mobile
            Legends
          </div>
          <div className="bg-[#0F1E2D] border border-blue-900/40 rounded-xl px-5 py-2 flex items-center gap-2 text-sm">
            <div className="w-2 h-2 rounded-full bg-yellow-400"></div> PUBG
            Mobile
          </div>
          <div className="bg-[#0F1E2D] border border-blue-900/40 rounded-xl px-5 py-2 flex items-center gap-2 text-sm">
            <div className="w-2 h-2 rounded-full bg-green-400"></div> eFootball
          </div>
        </div>
      </div>

      {/* STATS */}
      <div className="bg-[#0F1E2D] border-y border-blue-900/40 py-6 flex justify-center gap-20">
        {[
          ["128+", "Tim Terdaftar"],
          ["12", "Turnamen Aktif"],
          ["3", "Kategori Game"],
          ["100%", "Gratis"],
        ].map(([n, l]) => (
          <div key={l} className="text-center">
            <div className="text-3xl font-bold text-cyan-400">{n}</div>
            <div className="text-xs text-gray-400 mt-1">{l}</div>
          </div>
        ))}
      </div>

      {/* TENTANG */}
      <section id="tentang" className="px-10 py-20 bg-[#08111F]">
        <div className="max-w-5xl mx-auto text-center">
          <div className="text-xs bg-cyan-900/30 border border-cyan-500/30 text-cyan-400 px-4 py-1 rounded-full inline-block mb-5 tracking-widest">
            TENTANG PLATFORM
          </div>

          <h2 className="text-4xl font-bold mb-6">
            Tentang <span className="text-cyan-400">GAMEHUB</span>
          </h2>

          <p className="text-gray-400 text-lg leading-relaxed max-w-3xl mx-auto">
            GameHub adalah platform turnamen esports berbasis web yang membantu
            pemain dan tim untuk menemukan turnamen, melakukan pendaftaran,
            melihat detail kompetisi, serta memantau riwayat turnamen dalam satu
            sistem yang mudah digunakan.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="bg-[#0F1E2D] border border-blue-900/40 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-cyan-400 mb-3">
                Mudah Digunakan
              </h3>
              <p className="text-gray-400 text-sm">
                Pengguna dapat melihat dan mendaftar turnamen dengan tampilan
                yang sederhana dan jelas.
              </p>
            </div>

            <div className="bg-[#0F1E2D] border border-blue-900/40 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-cyan-400 mb-3">
                Data Terorganisir
              </h3>
              <p className="text-gray-400 text-sm">
                Admin dapat mengelola data turnamen, tim, peserta, dan jadwal
                pertandingan secara lebih rapi.
              </p>
            </div>

            <div className="bg-[#0F1E2D] border border-blue-900/40 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-cyan-400 mb-3">
                Berbasis Web
              </h3>
              <p className="text-gray-400 text-sm">
                Aplikasi dapat diakses melalui browser dan dikembangkan
                menggunakan React, Node.js, Express, dan database.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default LandingPage;
