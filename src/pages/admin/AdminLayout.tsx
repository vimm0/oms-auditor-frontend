import { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import {
  Route as RouteIcon,
  Users,
  LogIn,
  Calendar,
  FileCheck,
  TrendingUp,
  Receipt,
  Building2,
  ClipboardList,
  Database,
  PanelLeftClose,
  PanelLeft,
} from 'lucide-react';
import { IconButton } from '@mui/material';
import { ADMIN_ENTITY_ROUTES } from './adminEntities';

const customEntities = [
  { path: 'routes', label: 'Routes', icon: RouteIcon },
  { path: 'staff-details', label: 'Staff', icon: Users },
  { path: 'login-tracker', label: 'Login Tracker', icon: LogIn },
  { path: 'attendance', label: 'Attendance', icon: Calendar },
  { path: 'ver-files', label: 'Ver Files', icon: FileCheck },
  { path: 'ranking', label: 'Ranking', icon: TrendingUp },
  { path: 'vat-stmt', label: 'VAT Statement', icon: Receipt },
  { path: 'parti', label: 'Parti', icon: Building2 },
  { path: 'daily-works', label: 'Daily Works', icon: ClipboardList },
];

const genericEntities = Object.entries(ADMIN_ENTITY_ROUTES).map(([path, { title }]) => ({
  path,
  label: title,
  icon: Database,
}));

const entities = [...customEntities, ...genericEntities];

const ASIDE_WIDTH = 220;
const ASIDE_COLLAPSED = 56;

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', overflow: 'hidden' }}>
      <aside
        style={{
          width: collapsed ? ASIDE_COLLAPSED : ASIDE_WIDTH,
          minWidth: collapsed ? ASIDE_COLLAPSED : ASIDE_WIDTH,
          flexShrink: 0,
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          background: 'var(--glass-bg, rgba(255,255,255,0.95))',
          borderRight: '1px solid var(--border, rgba(0,0,0,0.12))',
          transition: 'width 0.2s ease',
          overflow: 'hidden',
        }}
      >
        <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 0.5rem 0.5rem 1rem', borderBottom: '1px solid var(--border, rgba(0,0,0,0.12))' }}>
          {!collapsed && <h2 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>Admin</h2>}
          <IconButton size="small" onClick={() => setCollapsed((c) => !c)} aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}>
            {collapsed ? <PanelLeft size={20} /> : <PanelLeftClose size={20} />}
          </IconButton>
        </div>
        <nav style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', minHeight: 0 }}>
          {entities.map(({ path, label, icon: Icon }) => (
            <NavLink
              key={path}
              to={`/admin/${path}`}
              title={collapsed ? label : undefined}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem 1rem',
                color: isActive ? 'var(--accent-primary, #1976d2)' : 'inherit',
                textDecoration: 'none',
                whiteSpace: 'nowrap',
              })}
            >
              <Icon size={18} style={{ flexShrink: 0 }} />
              {!collapsed && <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{label}</span>}
            </NavLink>
          ))}
        </nav>
      </aside>
      <main style={{ flex: 1, padding: '1.5rem', overflow: 'auto', minWidth: 0 }}>
        <Outlet />
      </main>
    </div>
  );
}
