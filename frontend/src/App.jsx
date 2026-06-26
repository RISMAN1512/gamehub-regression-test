import { Routes, Route, Navigate } from "react-router-dom";
import useAuthStore from "./store/useAuthStore";
// Pages
import LandingPage from "./pages/landingPage";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import DashboardPage from "./pages/dashboard/DashboardPage";
import TournamentPage from "./pages/tournament/TournamentPage";
import TournamentDetail from "./pages/tournament/TournamentDetailPage";
import ProfilePage from "./pages/profile/ProfilePage";
import PengaturanPage from "./pages/Pengaturan/PengaturanPage";
import RiwayatPage from "./pages/riwayat/RiwayatPage";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import AdminTurnamenPage from "./pages/admin/AdminTurnamenPage";
import AdminPesertaPage from "./pages/admin/AdminPesertaPage";
import AdminMatchPage from "./pages/admin/AdminMatchPage";
import AdminStatistikPage from "./pages/admin/AdminStatistikPage";
import AdminUsersPage from "./pages/admin/AdminUsersPage";
import JadwalPage from "./pages/jadwal/JadwalPage";
import TimSayaPage from "./pages/tim/TimSayaPage";
// Protected Route
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? children : <Navigate to="/login" />;
};
function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/turnamen" element={<TournamentPage />} />
      <Route path="/turnamen/:id" element={<TournamentDetail />} />
      {/* Protected */}
      <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
      <Route path="/profil" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
      <Route path="/pengaturan" element={<ProtectedRoute><PengaturanPage /></ProtectedRoute>} />
      <Route path="/riwayat" element={<ProtectedRoute><RiwayatPage /></ProtectedRoute>} />
      <Route path="/admin/dashboard" element={<ProtectedRoute><AdminDashboardPage /></ProtectedRoute>} />
      <Route path="/tim-saya" element={<ProtectedRoute><TimSayaPage /></ProtectedRoute>} />
      <Route path="/admin/turnamen" element={<ProtectedRoute><AdminTurnamenPage /></ProtectedRoute>} />
      <Route path="/admin/peserta" element={<ProtectedRoute><AdminPesertaPage /></ProtectedRoute>} />
      <Route path="/admin/match" element={<ProtectedRoute><AdminMatchPage /></ProtectedRoute>} />
      <Route path="/admin/statistik" element={<ProtectedRoute><AdminStatistikPage /></ProtectedRoute>} />
      <Route path="/admin/users" element={<ProtectedRoute><AdminUsersPage /></ProtectedRoute>} />
      <Route path="/jadwal" element={<ProtectedRoute><JadwalPage /></ProtectedRoute>} />
      {/* 404 */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
export default App;
