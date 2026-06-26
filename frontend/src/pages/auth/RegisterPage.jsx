import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api/axios";

function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nama: "",
    email: "",
    password: "",
    konfirmasi: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.konfirmasi) {
      setError("Password tidak cocok!");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await api.post("/auth/register", {
        nama: form.nama,
        email: form.email,
        password: form.password,
      });
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registrasi gagal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#060E18] flex items-center justify-center px-4">
      <div className="bg-[#0F1E2D] border border-blue-900/40 rounded-2xl p-10 w-full max-w-md shadow-2xl">
        <div className="text-center font-bold text-2xl tracking-widest mb-8 text-white">
          GAME<span className="text-cyan-400">HUB</span>
        </div>

        <div className="flex bg-white/5 rounded-xl p-1 mb-8">
          <Link
            to="/login"
            className="flex-1 text-center py-2 rounded-lg text-gray-400 text-sm font-semibold hover:text-white"
          >
            Masuk
          </Link>
          <Link
            to="/register"
            className="flex-1 text-center py-2 rounded-lg bg-cyan-500 text-[#060E18] text-sm font-semibold"
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
          {[
            {
              label: "NAMA LENGKAP",
              key: "nama",
              type: "text",
              placeholder: "Nama lengkap kamu",
            },
            {
              label: "EMAIL",
              key: "email",
              type: "email",
              placeholder: "email@kampus.ac.id",
            },
            {
              label: "PASSWORD",
              key: "password",
              type: "password",
              placeholder: "Min. 8 karakter",
            },
            {
              label: "KONFIRMASI PASSWORD",
              key: "konfirmasi",
              type: "password",
              placeholder: "Ulangi password",
            },
          ].map(({ label, key, type, placeholder }) => (
            <div key={key}>
              <label className="text-xs text-gray-400 font-semibold tracking-wider">
                {label}
              </label>
              <input
                type={type}
                placeholder={placeholder}
                className="w-full mt-2 bg-white/5 border border-blue-900/40 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-blue-500"
                value={form[key]}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                required
              />
            </div>
          ))}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-cyan-500 hover:bg-cyan-400 text-[#060E18] font-bold py-3 rounded-xl transition disabled:opacity-50 mt-2"
          >
            {loading ? "Memproses..." : "Buat Akun Gratis"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default RegisterPage;
