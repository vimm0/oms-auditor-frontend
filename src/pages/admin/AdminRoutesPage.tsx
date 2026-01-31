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

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Admin routes
      </Typography>
      <Paper variant="outlined" sx={{ overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 'calc(100vh - 220px)' }}>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Path</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Title</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>API base path</TableCell>
                <TableCell sx={{ fontWeight: 600 }} align="center">
                  Type
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedRows.map((row: AdminRouteRow) => (
                <TableRow key={row.path} hover>
                  <TableCell>
                    <Link component={RouterLink} to={`/admin/${row.path}`}>
                      {row.path}
                    </Link>
                  </TableCell>
                  <TableCell>{row.title}</TableCell>
                  <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.875rem' }}>
                    {row.basePath}
                  </TableCell>
                  <TableCell align="center">
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
