import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Chip,
  TablePagination,
  Link,
  Breadcrumbs,
} from '@mui/material';
import { useState, useMemo } from 'react';
import { ADMIN_ROUTES_LIST, type AdminRouteRow } from './adminRoutes';

export default function AdminRoutesPage() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);

  const paginatedRows = useMemo(() => {
    const start = page * rowsPerPage;
    return ADMIN_ROUTES_LIST.slice(start, start + rowsPerPage);
  }, [page, rowsPerPage]);

  const handleChangePage = (_: unknown, newPage: number) => setPage(newPage);
  const handleChangeRowsPerPage = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };

  const COL_MIN = 180;
  const stickyFirstCellSx = {
    position: 'sticky' as const,
    left: 0,
    zIndex: 1,
    backgroundColor: 'background.paper',
    borderRight: '1px solid',
    borderColor: 'divider',
    minWidth: 140,
  };
  const stickyFirstHeaderSx = { ...stickyFirstCellSx, zIndex: 3 };

  return (
    <Box>
      <Breadcrumbs sx={{ mb: 1.5 }} separator=">" aria-label="breadcrumb">
        <Link component={RouterLink} to="/admin" underline="none" color="inherit" sx={{ fontSize: '0.875rem' }}>
          Admin
        </Link>
        <Typography color="text.primary" sx={{ fontWeight: 600, fontSize: '0.875rem' }}>
          Routes
        </Typography>
      </Breadcrumbs>
      <Paper variant="outlined" sx={{ overflow: 'hidden', width: '100%' }}>
        <TableContainer sx={{ maxHeight: 'calc(100vh - 220px)', overflow: 'auto', width: '100%' }}>
          <Table stickyHeader size="small" sx={{ minWidth: '100%' }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600, ...stickyFirstHeaderSx, whiteSpace: 'nowrap' }}>Path</TableCell>
                <TableCell sx={{ fontWeight: 600, minWidth: COL_MIN, whiteSpace: 'nowrap' }}>Title</TableCell>
                <TableCell sx={{ fontWeight: 600, minWidth: COL_MIN, fontFamily: 'monospace', fontSize: '0.875rem', whiteSpace: 'nowrap' }}>API base path</TableCell>
                <TableCell sx={{ fontWeight: 600, minWidth: 100, whiteSpace: 'nowrap' }} align="center">
                  Type
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedRows.map((row: AdminRouteRow) => (
                <TableRow key={row.path} hover>
                  <TableCell sx={{ ...stickyFirstCellSx, whiteSpace: 'nowrap' }}>
                    <Link component={RouterLink} to={`/admin/${row.path}`}>
                      {row.path}
                    </Link>
                  </TableCell>
                  <TableCell sx={{ minWidth: COL_MIN, whiteSpace: 'nowrap' }}>{row.title}</TableCell>
                  <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.875rem', minWidth: COL_MIN, whiteSpace: 'nowrap' }}>
                    {row.basePath}
                  </TableCell>
                  <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>
                    <Chip
                      label={row.type}
                      size="small"
                      color={row.type === 'custom' ? 'primary' : 'default'}
                      variant="outlined"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={ADMIN_ROUTES_LIST.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[10, 25, 50, 100]}
        />
      </Paper>
    </Box>
  );
}
