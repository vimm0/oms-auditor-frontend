import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/MainLayout';
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
import AdminRoutesPage from './pages/admin/AdminRoutesPage';
import GenericEntityPage from './pages/admin/GenericEntityPage';
import { ADMIN_ENTITY_ROUTES } from './pages/admin/adminEntities';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="attendance" element={<Attendance />} />
          <Route path="vat" element={<VatStatement />} />
          <Route path="import" element={<ImportData />} />
          <Route path="admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="/admin/staff-details" replace />} />
            <Route path="routes" element={<AdminRoutesPage />} />
            <Route path="staff-details" element={<StaffDetailsPage />} />
            <Route path="login-tracker" element={<LoginTrackerPage />} />
            <Route path="attendance" element={<AttendancePage />} />
            <Route path="ver-files" element={<VerFilesPage />} />
            <Route path="ranking" element={<RankingPage />} />
            <Route path="vat-stmt" element={<VatStmtPage />} />
            <Route path="parti" element={<PartiPage />} />
            <Route path="daily-works" element={<DailyWorksPage />} />
            {Object.entries(ADMIN_ENTITY_ROUTES).map(([route, { title, basePath }]) => (
              <Route
                key={route}
                path={route}
                element={<GenericEntityPage title={title} basePath={basePath} />}
              />
            ))}
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
