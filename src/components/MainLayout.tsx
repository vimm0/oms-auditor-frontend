import { useState, useEffect, useRef } from 'react';
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
  Divider,
  Toolbar,
  useTheme,
  useMediaQuery,
  Dialog,
  DialogContent,
  TextField,
  InputAdornment,
} from '@mui/material';
import {
  Menu as MenuIcon,
  X,
  ChevronDown,
  ChevronRight,
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
  Search as SearchIcon,
  PanelLeftClose,
  PanelRightOpen,
} from 'lucide-react';
import { ADMIN_ENTITY_ROUTES } from '../pages/admin/adminEntities';

const DRAWER_WIDTH = 280;
const DRAWER_COLLAPSED_WIDTH = 72;

const mainNavItems = [
  { to: '/dashboard', label: 'Home', icon: LayoutDashboard },
  { to: '/attendance', label: 'Attendance', icon: Calendar },
  { to: '/vat', label: 'VAT Statement', icon: Receipt },
  { to: '/import', label: 'Import Data', icon: Upload },
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

/** Max number of nav items shown in the command palette modal. */
const NAV_MODAL_MAX_ITEMS = 8;

/** All routes for the command palette: main + admin. */
const allNavRoutes: { path: string; label: string }[] = [
  ...mainNavItems.map(({ to, label }) => ({ path: to, label })),
  ...adminNavItems.map(({ path, label }) => ({ path: `/admin/${path}`, label })),
];

export default function MainLayout() {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerCollapsed, setDrawerCollapsed] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(null);
  const [adminExpanded, setAdminExpanded] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');
  const adminOpen = adminExpanded || isAdmin;

  useEffect(() => {
    if (!isAdmin) setAdminExpanded(false);
  }, [isAdmin]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchModalOpen((open) => !open);
      }
      if (e.key === 'Escape') setSearchModalOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const drawerVariant = isDesktop ? 'permanent' : 'temporary';
  const drawerOpenState = isDesktop ? true : drawerOpen;
  const collapsed = isDesktop && drawerCollapsed;
  const drawerWidth = isDesktop && drawerCollapsed ? DRAWER_COLLAPSED_WIDTH : DRAWER_WIDTH;

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
      {/* Header: when expanded = title + collapse button (right); when collapsed = icon + expand button (right); mobile = title + close (X) */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'flex-end' : 'space-between',
          px: collapsed ? 2 : 2.5,
          py: 2,
          minHeight: 56,
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        {!collapsed && (
          <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1rem', color: 'text.primary' }}>
            OMS Auditor
          </Typography>
        )}
        {isDesktop ? (
          <IconButton
            size="small"
            onClick={() => setDrawerCollapsed((c) => !c)}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? (
              <PanelRightOpen size={20} />
            ) : (
              <PanelLeftClose size={20} />
            )}
          </IconButton>
        ) : (
          <IconButton size="small" onClick={() => setDrawerOpen(false)} aria-label="Close menu">
            <X size={20} />
          </IconButton>
        )}
      </Box>

      <List sx={{ flex: 1, overflow: 'auto', py: 1.5, px: collapsed ? 0 : 0 }}>
        {mainNavItems.map(({ to, label, icon: Icon }) => {
          const selected = location.pathname === to;
          return (
            <ListItemButton
              key={to}
              component={NavLink}
              to={to}
              onClick={() => !isDesktop && setDrawerOpen(false)}
              selected={selected}
              sx={{
                py: 1.25,
                px: collapsed ? 2 : 2.5,
                justifyContent: collapsed ? 'center' : 'flex-start',
                borderRadius: 0,
                '&.Mui-selected': {
                  bgcolor: 'action.hover',
                  '&:hover': { bgcolor: 'action.selected' },
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: collapsed ? 0 : 40, color: 'text.secondary', justifyContent: 'center' }}>
                <Icon size={20} />
              </ListItemIcon>
              {!collapsed && (
                <ListItemText
                  primary={label}
                  primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: selected ? 600 : 400 }}
                  sx={{ my: 0 }}
                />
              )}
            </ListItemButton>
          );
        })}
        <ListItemButton
          onClick={() => {
            if (collapsed) {
              navigate('/admin');
            } else {
              setAdminExpanded((v) => !v);
            }
          }}
          component="button"
          sx={{
            py: 1.25,
            px: collapsed ? 2 : 2.5,
            justifyContent: collapsed ? 'center' : 'flex-start',
            borderRadius: 0,
            bgcolor: adminOpen ? 'action.hover' : 'transparent',
            '&:hover': { bgcolor: 'action.hover' },
          }}
        >
          <ListItemIcon sx={{ minWidth: collapsed ? 0 : 40, color: 'text.secondary', justifyContent: 'center' }}>
            <Settings size={20} />
          </ListItemIcon>
          {!collapsed && (
            <>
              <ListItemText
                primary="Admin"
                primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: adminOpen ? 600 : 400 }}
                sx={{ my: 0 }}
              />
              {adminOpen ? (
                <ChevronDown size={18} style={{ color: 'var(--mui-palette-text-secondary)', flexShrink: 0 }} />
              ) : (
                <ChevronRight size={18} style={{ color: 'var(--mui-palette-text-secondary)', flexShrink: 0 }} />
              )}
            </>
          )}
        </ListItemButton>
        {!collapsed && adminOpen &&
          adminNavItems.map(({ path, label }) => {
            const to = `/admin/${path}`;
            const selected = location.pathname === to;
            return (
              <ListItemButton
                key={path}
                component={NavLink}
                to={to}
                onClick={() => !isDesktop && setDrawerOpen(false)}
                selected={selected}
                sx={{
                  py: 1.25,
                  pl: 4.5,
                  pr: 2.5,
                  borderRadius: 0,
                  '&.Mui-selected': {
                    bgcolor: 'action.hover',
                    '&:hover': { bgcolor: 'action.selected' },
                  },
                }}
              >
                <ListItemText
                  primary={label}
                  primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: selected ? 600 : 400 }}
                  sx={{ my: 0 }}
                />
              </ListItemButton>
            );
          })}
      </List>

      {collapsed ? (
        <IconButton
          size="medium"
          onClick={() => setSearchModalOpen(true)}
          aria-label="Search"
          sx={{ mx: 'auto', mb: 1 }}
        >
          <SearchIcon size={20} />
        </IconButton>
      ) : (
        <Box
          role="button"
          tabIndex={0}
          onClick={() => setSearchModalOpen(true)}
          onKeyDown={(e) => e.key === 'Enter' && setSearchModalOpen(true)}
          sx={{
            flexShrink: 0,
            mx: 2.5,
            mb: 1.5,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            py: 1,
            px: 1.5,
            borderRadius: 1,
            border: 1,
            borderColor: 'divider',
            bgcolor: 'action.hover',
            color: 'text.secondary',
            fontSize: '0.8125rem',
            cursor: 'pointer',
            '&:hover': { bgcolor: 'action.selected' },
          }}
        >
          <Typography component="span" sx={{ flex: 1, fontSize: 'inherit' }}>
            Search
          </Typography>
          <Typography component="span" sx={{ fontSize: 'inherit', opacity: 0.8 }}>
            ⌘K
          </Typography>
        </Box>
      )}

      <Divider />
      <Box
        component="button"
        onClick={handleUserMenuOpen}
        aria-label="User menu"
        sx={{
          border: 0,
          background: 'none',
          cursor: 'pointer',
          width: '100%',
          px: collapsed ? 1.5 : 2.5,
          py: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'flex-start',
          gap: 1.5,
          minHeight: 72,
          '&:hover': { bgcolor: 'action.hover' },
        }}
      >
        <Avatar sx={{ width: 40, height: 40, bgcolor: 'primary.main', fontSize: '0.875rem', flexShrink: 0 }}>
          U
        </Avatar>
        {!collapsed && (
          <>
            <ListItemText
              primary="User"
              secondary="user@example.com"
              primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: 600 }}
              secondaryTypographyProps={{ fontSize: '0.75rem', color: 'text.secondary' }}
              sx={{ flex: 1, minWidth: 0, my: 0 }}
            />
            <MoreVertical size={20} style={{ flexShrink: 0, opacity: 0.7 }} />
          </>
        )}
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
          left: isDesktop ? drawerWidth : 0,
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
            width: drawerWidth,
            boxSizing: 'border-box',
            ...(isDesktop && {
              position: 'fixed',
              borderRight: 1,
              borderColor: 'divider',
              boxShadow: '2px 0 8px rgba(0,0,0,0.06)',
            }),
          },
        }}
      >
        {drawerContent}
      </Drawer>

      <Box
        component="main"
        sx={{
          flex: 1,
          px: 3,
          py: 2.5,
          pt: isDesktop ? 2.5 : 7,
          width: '100%',
          minWidth: 0,
          display: 'flex',
          flexDirection: 'column',
          ...(isDesktop && { ml: `${drawerWidth}px` }),
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

      <Dialog
        open={searchModalOpen}
        onClose={() => { setSearchModalOpen(false); setSearchQuery(''); }}
        maxWidth="sm"
        fullWidth
        TransitionProps={{
          onEntered: () => searchInputRef.current?.focus(),
        }}
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: 24,
            overflow: 'hidden',
          },
        }}
        slotProps={{ backdrop: { sx: { bgcolor: 'rgba(0,0,0,0.4)' } } }}
      >
        <DialogContent sx={{ p: 0, '&:first-of-type': { pt: 0 } }}>
          <TextField
            inputRef={searchInputRef}
            fullWidth
            placeholder="Type '?' to see available actions"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            variant="outlined"
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon size={20} style={{ color: 'var(--mui-palette-text-secondary)' }} />
                </InputAdornment>
              ),
              sx: {
                '& fieldset': { border: 'none', borderBottom: 1, borderColor: 'divider', borderRadius: 0 },
                bgcolor: 'transparent',
                py: 1.5,
                px: 2,
              },
            }}
            sx={{ '& .MuiOutlinedInput-root': { '&:hover fieldset': { borderColor: 'divider' } } }}
          />
          <Box sx={{ px: 2, pb: 2, pt: 1 }}>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, letterSpacing: 1, display: 'block', mb: 1 }}>
              NAVIGATE TO
            </Typography>
            <List disablePadding>
              {allNavRoutes
                .filter(
                  (r) =>
                    !searchQuery.trim() ||
                    r.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    r.path.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .slice(0, NAV_MODAL_MAX_ITEMS)
                .map(({ path, label }) => (
                  <ListItemButton
                    key={path}
                    onClick={() => {
                      navigate(path);
                      setSearchModalOpen(false);
                      setSearchQuery('');
                      setDrawerOpen(false);
                    }}
                    sx={{
                      py: 1.25,
                      px: 1.5,
                      borderRadius: 1,
                      '&:hover': { bgcolor: 'action.hover' },
                    }}
                  >
                    <ListItemText
                      primary={label}
                      primaryTypographyProps={{ fontSize: '0.875rem' }}
                    />
                  </ListItemButton>
                ))}
            </List>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
