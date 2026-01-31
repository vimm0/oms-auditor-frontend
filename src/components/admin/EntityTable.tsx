import { useState, useEffect } from 'react';
import { apiGet, apiDelete, PaginatedResponse } from '../../lib/api';
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
  TextField,
  Button,
  TablePagination,
  TableSortLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
} from '@mui/material';

export interface ColumnDef<T> {
  key: keyof T | string;
  label: string;
  render?: (row: T) => React.ReactNode;
}

interface EntityTableProps<T extends { ID: number }> {
  title: string;
  basePath: string;
  columns: ColumnDef<T>[];
  onAdd: () => void;
  onEdit: (row: T) => void;
  getRowKey: (row: T) => number;
}

export function EntityTable<T extends { ID: number }>({
  title,
  basePath,
  columns,
  onAdd,
  onEdit,
  getRowKey,
}: EntityTableProps<T>) {
  const [data, setData] = useState<PaginatedResponse<T> | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [sort, setSort] = useState<string | null>(null);
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: number; name?: string } | null>(null);

  const fetchList = async () => {
    setLoading(true);
    setError(null);
    try {
      const params: Record<string, string | number> = {
        page: page + 1,
        page_size: rowsPerPage,
        order,
      };
      if (sort) params.sort = sort;
      const res = await apiGet<PaginatedResponse<T>>(basePath, params);
      setData(res);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchList();
  }, [basePath, page, rowsPerPage, sort, order]);

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    try {
      await apiDelete(`${basePath}/${deleteConfirm.id}`);
      setDeleteConfirm(null);
      fetchList();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Delete failed');
    }
  };

  const toggleSort = (key: string) => {
    if (sort === key) setOrder((o) => (o === 'asc' ? 'desc' : 'asc'));
    else {
      setSort(key);
      setOrder('asc');
    }
  };

  const handleChangePage = (_: unknown, newPage: number) => setPage(newPage);
  const handleChangeRowsPerPage = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };

  if (error) return <Alert severity="error" sx={{ m: 1 }}>{error}</Alert>;
  if (loading && !data) return <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1 }}><CircularProgress size={20} /> Loading...</Box>;

  const items = data?.items ?? [];
  const total = data?.total ?? 0;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 1 }}>
        <Typography variant="h6">{title}</Typography>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <TextField
            size="small"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ minWidth: 160 }}
          />
          <Button variant="contained" onClick={onAdd}>Create</Button>
        </Box>
      </Box>

      <Paper variant="outlined" sx={{ overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 'calc(100vh - 280px)' }}>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                {columns.map((col) => (
                  <TableCell key={String(col.key)} sortDirection={sort === col.key ? order : false} sx={{ fontWeight: 600 }}>
                    <TableSortLabel
                      active={sort === col.key}
                      direction={sort === col.key ? order : 'asc'}
                      onClick={() => toggleSort(String(col.key))}
                    >
                      {col.label}
                    </TableSortLabel>
                  </TableCell>
                ))}
                <TableCell sx={{ fontWeight: 600, width: 140 }} align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={columns.length + 1} align="center" sx={{ py: 3, color: 'text.secondary' }}>
                    No records
                  </TableCell>
                </TableRow>
              ) : (
                items.map((row) => (
                  <TableRow key={getRowKey(row)} hover>
                    {columns.map((col) => (
                      <TableCell key={String(col.key)}>
                        {col.render ? col.render(row) : String((row as Record<string, unknown>)[col.key as string] ?? '')}
                      </TableCell>
                    ))}
                    <TableCell align="right">
                      <Button size="small" onClick={() => onEdit(row)} sx={{ mr: 0.5 }}>Edit</Button>
                      <Button size="small" color="error" onClick={() => setDeleteConfirm({ id: row.ID })}>Delete</Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          component="div"
          count={total}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[10, 20, 50, 100]}
        />
      </Paper>

      <Dialog open={!!deleteConfirm} onClose={() => setDeleteConfirm(null)}>
        <DialogTitle>Delete record</DialogTitle>
        <DialogContent>Delete this record?</DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirm(null)}>Cancel</Button>
          <Button onClick={handleDelete} color="error" variant="contained">Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
