import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import useAuthStore from "../../store/useAuthStore";

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const res = await api.post("/auth/login", form);

      const user = res.data.user;
      const token = res.data.token;

      login(user, token);

      if (user.role === "admin") {
        navigate("/admin/dashboard", { replace: true });
      } else {
        navigate("/dashboard", { replace: true });
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login gagal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#060E18] flex items-center justify-center px-4">
      <div className="bg-[#0F1E2D] border border-blue-900/40 rounded-2xl p-10 w-full max-w-md shadow-2xl">
        <div className="text-center font-bold text-2xl tracking-widest mb-8">
          GAME<span className="text-cyan-400">HUB</span>
        </div>

        {/* TABS */}
        <div className="flex bg-white/5 rounded-xl p-1 mb-8">
          <Link
            to="/login"
            className="flex-1 text-center py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold"
          >
            Masuk
          </Link>

          <Link
            to="/register"
            className="flex-1 text-center py-2 rounded-lg text-gray-400 text-sm font-semibold hover:text-white"
          >
            Daftar
          </Link>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-xs text-gray-400 font-semibold tracking-wider">
              EMAIL
            </label>

            <input
              type="email"
              placeholder="email@gamehub.com"
              className="w-full mt-2 bg-white/5 border border-blue-900/40 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-blue-500"
              value={form.email}
              onChange={(e) =>
                setForm({
                  ...form,
                  email: e.target.value,
                })
              }
              required
            />
          </div>

          <div>
            <label className="text-xs text-gray-400 font-semibold tracking-wider">
              PASSWORD
            </label>

            <input
              type="password"
              placeholder="••••••••"
              className="w-full mt-2 bg-white/5 border border-blue-900/40 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-blue-500"
              value={form.password}
              onChange={(e) =>
                setForm({
                  ...form,
                  password: e.target.value,
                })
              }
              required
            />
          </div>

          <div className="text-right">
            <span className="text-xs text-blue-400 cursor-pointer hover:underline">
              Lupa password?
            </span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition disabled:opacity-50"
          >
            {loading ? "Memproses..." : "Masuk ke GameHub"}
          </button>
        </form>

        <p className="text-center text-xs text-gray-500 mt-6">
          Belum punya akun?{" "}
          <Link to="/register" className="text-blue-400 hover:underline">
            Daftar gratis
          </Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
