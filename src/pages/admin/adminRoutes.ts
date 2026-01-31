/** Single source for all admin routes: custom pages + generic entity tables. */
import { ADMIN_ENTITY_ROUTES } from './adminEntities';

const customRoutes: { path: string; title: string }[] = [
  { path: 'staff-details', title: 'Staff' },
  { path: 'login-tracker', title: 'Login Tracker' },
  { path: 'attendance', title: 'Attendance' },
  { path: 'ver-files', title: 'Ver Files' },
  { path: 'ranking', title: 'Ranking' },
  { path: 'vat-stmt', title: 'VAT Statement' },
  { path: 'parti', title: 'Parti' },
  { path: 'daily-works', title: 'Daily Works' },
];

export type AdminRouteType = 'custom' | 'generic';

export interface AdminRouteRow {
  path: string;
  title: string;
  basePath: string;
  type: AdminRouteType;
}

const customList: AdminRouteRow[] = customRoutes.map(({ path, title }) => ({
  path,
  title,
  basePath: `/api/admin/${path}`,
  type: 'custom',
}));

const genericList: AdminRouteRow[] = Object.entries(ADMIN_ENTITY_ROUTES).map(([path, { title, basePath }]) => ({
  path,
  title,
  basePath,
  type: 'generic',
}));

/** All admin routes for the routes table (custom first, then generic). */
export const ADMIN_ROUTES_LIST: AdminRouteRow[] = [...customList, ...genericList];
