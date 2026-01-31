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
  IconButton,
  Tooltip,
  TablePagination,
  TableSortLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
} from '@mui/material';
import { Pencil, Trash2 } from 'lucide-react';

export interface ColumnDef<T> {
  key: keyof T | string;
  label: string;
  render?: (row: T) => React.ReactNode;
}

/** Format a date as "EEEE, MMMM d, yyyy" (e.g. Saturday, January 31, 2025). */
const longDateFormatter = new Intl.DateTimeFormat('en-US', {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
});

function toDate(val: unknown): Date | null {
  if (val == null) return null;
  if (typeof val === 'string' && (/^\d{4}-\d{2}-\d{2}/.test(val) || val.includes('T'))) {
    const d = new Date(val);
    return Number.isNaN(d.getTime()) ? null : d;
  }
  if (typeof val === 'number' && val > 1e10) {
    const d = new Date(val);
    return Number.isNaN(d.getTime()) ? null : d;
  }
  return null;
}

/** Format a cell value: dates as EEEE, MMMM d, yyyy; else string. */
function formatCellValue(val: unknown): React.ReactNode {
  const d = toDate(val);
  if (d) return longDateFormatter.format(d);
  if (val == null) return '';
  return String(val);
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
  const [appliedSearch, setAppliedSearch] = useState('');
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
      if (appliedSearch) params.q = appliedSearch;
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
  }, [basePath, page, rowsPerPage, sort, order, appliedSearch]);

  // Debounce search: update appliedSearch 400ms after user stops typing; clear immediately when empty
  useEffect(() => {
    const term = search.trim();
    if (term === '') {
      setAppliedSearch('');
      setPage(0);
      return;
    }
    const t = setTimeout(() => {
      setAppliedSearch(term);
      setPage(0);
    }, 400);
    return () => clearTimeout(t);
  }, [search]);

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

  // Client-side filter by search (covers current page when backend doesn't support `q`)
  const filteredItems = appliedSearch
    ? items.filter((row) =>
        columns.some((col) => {
          const v = (row as Record<string, unknown>)[col.key as string];
          if (v == null) return false;
          return String(v).toLowerCase().includes(appliedSearch.toLowerCase());
        })
      )
    : items;

  const COLUMN_MIN_WIDTH = 240;

  const stickyFirstCellSx = {
    position: 'sticky' as const,
    left: 0,
    zIndex: 1,
    backgroundColor: 'background.paper',
    borderRight: '1px solid',
    borderColor: 'divider',
    minWidth: 140,
    whiteSpace: 'nowrap',
  };
  const stickyFirstHeaderSx = {
    ...stickyFirstCellSx,
    zIndex: 3,
    backgroundColor: 'background.paper',
  };
  const dataColumnSx = { minWidth: COLUMN_MIN_WIDTH, whiteSpace: 'nowrap' };
  const dataColumnHeaderSx = { fontWeight: 600, minWidth: COLUMN_MIN_WIDTH, whiteSpace: 'nowrap' };

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

      <Paper variant="outlined" sx={{ overflow: 'hidden', width: '100%' }}>
        <TableContainer sx={{ maxHeight: 'calc(100vh - 280px)', overflow: 'auto', width: '100%' }}>
          <Table stickyHeader size="small" sx={{ minWidth: '100%' }}>
            <TableHead>
              <TableRow>
                {columns.map((col, index) => (
                  <TableCell
                    key={String(col.key)}
                    sortDirection={sort === col.key ? order : false}
                    sx={index === 0 ? stickyFirstHeaderSx : dataColumnHeaderSx}
                  >
                    <TableSortLabel
                      active={sort === col.key}
                      direction={sort === col.key ? order : 'asc'}
                      onClick={() => toggleSort(String(col.key))}
                    >
                      {col.label}
                    </TableSortLabel>
                  </TableCell>
                ))}
                <TableCell sx={{ fontWeight: 600, width: 140, minWidth: 140, whiteSpace: 'nowrap' }} align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredItems.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={columns.length + 1} align="center" sx={{ py: 3, color: 'text.secondary' }}>
                    {items.length === 0 ? 'No records' : 'No matches for search'}
                  </TableCell>
                </TableRow>
              ) : (
                filteredItems.map((row) => (
                  <TableRow key={getRowKey(row)} hover>
                    {columns.map((col, index) => (
                      <TableCell key={String(col.key)} sx={index === 0 ? stickyFirstCellSx : dataColumnSx}>
                        {col.render ? col.render(row) : formatCellValue((row as Record<string, unknown>)[col.key as string])}
                      </TableCell>
                    ))}
                    <TableCell align="right">
                      <Tooltip title="Edit">
                        <IconButton size="small" onClick={() => onEdit(row)} aria-label="Edit">
                          <Pencil size={18} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton size="small" color="error" onClick={() => setDeleteConfirm({ id: row.ID })} aria-label="Delete">
                          <Trash2 size={18} />
                        </IconButton>
                      </Tooltip>
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
