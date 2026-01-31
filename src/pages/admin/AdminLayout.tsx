import { Outlet, NavLink } from 'react-router-dom';
import {
  Users,
  LogIn,
  Calendar,
  FileCheck,
  TrendingUp,
  Receipt,
  Building2,
  ClipboardList,
} from 'lucide-react';

const entities = [
  { path: 'staff-details', label: 'Staff', icon: Users },
  { path: 'login-tracker', label: 'Login Tracker', icon: LogIn },
  { path: 'attendance', label: 'Attendance', icon: Calendar },
  { path: 'ver-files', label: 'Ver Files', icon: FileCheck },
  { path: 'ranking', label: 'Ranking', icon: TrendingUp },
  { path: 'vat-stmt', label: 'VAT Statement', icon: Receipt },
  { path: 'parti', label: 'Parti', icon: Building2 },
  { path: 'daily-works', label: 'Daily Works', icon: ClipboardList },
];

export default function AdminLayout() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <aside
        style={{
          width: 220,
          background: 'var(--glass-bg, rgba(255,255,255,0.06))',
          borderRight: '1px solid var(--border, rgba(255,255,255,0.1))',
          padding: '1rem 0',
        }}
      >
        <h2 style={{ padding: '0 1rem', marginBottom: '1rem', fontSize: '1rem', fontWeight: 600 }}>
          Admin
        </h2>
        <nav>
          {entities.map(({ path, label, icon: Icon }) => (
            <NavLink
              key={path}
              to={`/admin/${path}`}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem 1rem',
                color: isActive ? 'var(--accent, #3b82f6)' : 'inherit',
                textDecoration: 'none',
              })}
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <main style={{ flex: 1, padding: '1.5rem', overflow: 'auto' }}>
        <Outlet />
      </main>
    </div>
  );
}
