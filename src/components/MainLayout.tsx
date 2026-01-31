import { useState } from 'react';
import { Outlet, useNavigate, NavLink, useLocation } from 'react-router-dom';
import {
  Box,
  IconButton,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Avatar,
  Menu,
  MenuItem,
  ListItem,
  Divider,
  Toolbar,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Menu as MenuIcon,
  X,
  LayoutDashboard,
  Calendar,
  Receipt,
  Upload,
  Settings,
  User,
  LogOut,
  Route as RouteIcon,
  Users,
  LogIn,
  FileCheck,
  TrendingUp,
  Building2,
  ClipboardList,
  Database,
  MoreVertical,
} from 'lucide-react';
import { ADMIN_ENTITY_ROUTES } from '../pages/admin/adminEntities';

const DRAWER_WIDTH = 280;

const mainNavItems = [
  { to: '/dashboard', label: 'Home', icon: LayoutDashboard },
  { to: '/attendance', label: 'Attendance', icon: Calendar },
  { to: '/vat', label: 'VAT Statement', icon: Receipt },
  { to: '/import', label: 'Import Data', icon: Upload },
  { to: '/admin/staff-details', label: 'Admin', icon: Settings },
];

const adminCustomItems = [
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

const adminGenericItems = Object.entries(ADMIN_ENTITY_ROUTES).map(([path, { title }]) => ({
  path,
  label: title,
  icon: Database,
}));

const adminNavItems = [...adminCustomItems, ...adminGenericItems];

export default function MainLayout() {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  const drawerVariant = isDesktop ? 'permanent' : 'temporary';
  const drawerOpenState = isDesktop ? true : drawerOpen;

  const handleUserMenuOpen = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    setUserMenuAnchor(e.currentTarget);
  };
  const handleUserMenuClose = () => setUserMenuAnchor(null);

  const handleLogout = () => {
    handleUserMenuClose();
    setDrawerOpen(false);
    navigate('/login');
  };

  const drawerContent = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1rem' }}>
          OMS Auditor
        </Typography>
        {!isDesktop && (
          <IconButton size="small" onClick={() => setDrawerOpen(false)} aria-label="Close menu">
            <X size={20} />
          </IconButton>
        )}
      </Box>

      <List sx={{ flex: 1, overflow: 'auto', py: 1 }}>
            {isAdmin
              ? adminNavItems.map(({ path, label, icon: Icon }) => (
                  <ListItemButton
                    key={path}
                    component={NavLink}
                    to={`/admin/${path}`}
                    onClick={() => setDrawerOpen(false)}
                    selected={location.pathname === `/admin/${path}`}
                    sx={{ py: 1 }}
                  >
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      <Icon size={18} />
                    </ListItemIcon>
                    <ListItemText primary={label} primaryTypographyProps={{ fontSize: '0.875rem' }} />
                  </ListItemButton>
                ))
              : mainNavItems.map(({ to, label, icon: Icon }) => (
                  <ListItemButton
                    key={to}
                    component={NavLink}
                    to={to}
                    onClick={() => setDrawerOpen(false)}
                    selected={location.pathname === to}
                    sx={{ py: 1 }}
                  >
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      <Icon size={18} />
                    </ListItemIcon>
                    <ListItemText primary={label} primaryTypographyProps={{ fontSize: '0.875rem' }} />
                  </ListItemButton>
                ))}
      </List>

      <Divider />
      <Box sx={{ p: 2 }}>
            <ListItem disablePadding sx={{ alignItems: 'center', gap: 1.5 }}>
              <Avatar sx={{ width: 36, height: 36, bgcolor: 'primary.main', fontSize: '0.875rem' }}>
                U
              </Avatar>
              <ListItemText
                primary="User"
                secondary="user@example.com"
                primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: 600 }}
                secondaryTypographyProps={{ fontSize: '0.75rem' }}
                sx={{ flex: 1, minWidth: 0 }}
              />
              <IconButton size="small" onClick={handleUserMenuOpen} aria-label="User menu">
                <MoreVertical size={20} />
              </IconButton>
            </ListItem>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Toolbar
        variant="dense"
        sx={{
          position: 'fixed',
          top: 0,
          left: isDesktop ? DRAWER_WIDTH : 0,
          right: 0,
          zIndex: theme.zIndex.drawer - 1,
          borderBottom: 1,
          borderColor: 'divider',
          minHeight: 48,
          bgcolor: 'background.paper',
          display: isDesktop ? 'none' : 'flex',
        }}
      >
        <IconButton
          edge="start"
          onClick={() => setDrawerOpen(true)}
          aria-label="Open menu"
          sx={{ mr: 1 }}
        >
          <MenuIcon size={24} />
        </IconButton>
      </Toolbar>

      <Drawer
        variant={drawerVariant}
        anchor="left"
        open={drawerOpenState}
        onClose={() => setDrawerOpen(false)}
        sx={{
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            boxSizing: 'border-box',
            ...(isDesktop && { position: 'fixed', borderRight: 1, borderColor: 'divider' }),
          },
        }}
      >
        {drawerContent}
      </Drawer>

      <Box
        component="main"
        sx={{
          flex: 1,
          p: 2,
          mt: isDesktop ? 0 : 6,
          width: '100%',
          minWidth: 0,
          ...(isDesktop && { ml: `${DRAWER_WIDTH}px` }),
        }}
      >
        <Outlet />
      </Box>

      <Menu
        anchorEl={userMenuAnchor}
        open={Boolean(userMenuAnchor)}
        onClose={handleUserMenuClose}
        onClick={handleUserMenuClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        slotProps={{ paper: { sx: { minWidth: 180 } } }}
      >
        <MenuItem component={NavLink} to="/dashboard" onClick={() => setDrawerOpen(false)}>
          <ListItemIcon>
            <User size={18} />
          </ListItemIcon>
          <ListItemText>Profile</ListItemText>
        </MenuItem>
        <MenuItem component={NavLink} to="/admin/staff-details" onClick={() => setDrawerOpen(false)}>
          <ListItemIcon>
            <Settings size={18} />
          </ListItemIcon>
          <ListItemText>Settings</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <LogOut size={18} />
          </ListItemIcon>
          <ListItemText>Logout</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  );
}
