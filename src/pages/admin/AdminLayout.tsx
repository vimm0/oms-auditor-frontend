import { Outlet } from 'react-router-dom';

export default function AdminLayout() {
  return (
    <main style={{ flex: 1, padding: '1.5rem', overflow: 'auto', minWidth: 0 }}>
      <Outlet />
    </main>
  );
}
