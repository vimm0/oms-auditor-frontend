import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Attendance from './pages/Attendance';
import VatStatement from './pages/VatStatement';
import ImportData from './pages/ImportData';
import AdminLayout from './pages/admin/AdminLayout';
import StaffDetailsPage from './pages/admin/StaffDetailsPage';
import LoginTrackerPage from './pages/admin/LoginTrackerPage';
import AttendancePage from './pages/admin/AttendancePage';
import VerFilesPage from './pages/admin/VerFilesPage';
import RankingPage from './pages/admin/RankingPage';
import VatStmtPage from './pages/admin/VatStmtPage';
import PartiPage from './pages/admin/PartiPage';
import DailyWorksPage from './pages/admin/DailyWorksPage';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/attendance" element={<Attendance />} />
        <Route path="/vat" element={<VatStatement />} />
        <Route path="/import" element={<ImportData />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/staff-details" replace />} />
          <Route path="staff-details" element={<StaffDetailsPage />} />
          <Route path="login-tracker" element={<LoginTrackerPage />} />
          <Route path="attendance" element={<AttendancePage />} />
          <Route path="ver-files" element={<VerFilesPage />} />
          <Route path="ranking" element={<RankingPage />} />
          <Route path="vat-stmt" element={<VatStmtPage />} />
          <Route path="parti" element={<PartiPage />} />
          <Route path="daily-works" element={<DailyWorksPage />} />
        </Route>
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
