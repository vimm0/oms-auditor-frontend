import { useState, useEffect } from 'react';
import { apiGet, apiDelete, PaginatedResponse } from '../../lib/api';

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
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
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
      const params: Record<string, string | number> = { page, page_size: pageSize, order };
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
  }, [basePath, page, pageSize, sort, order]);

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

  if (error) return <div className="glass-panel" style={{ padding: '1rem', color: 'red' }}>{error}</div>;
  if (loading && !data) return <div className="glass-panel" style={{ padding: '1rem' }}>Loading...</div>;

  const items = data?.items ?? [];
  const total = data?.total ?? 0;
  const pages = data?.pages ?? 0;

  return (
    <div>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>{title}</h2>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ padding: '0.35rem 0.5rem', borderRadius: 6, border: '1px solid var(--border)', background: 'var(--glass-bg)', minWidth: 160 }}
          />
          <button type="button" onClick={onAdd} className="glass-panel" style={{ padding: '0.5rem 1rem' }}>
            Create
          </button>
        </div>
      </header>

      <div className="glass-panel" style={{ overflow: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              {columns.map((col) => (
                <th
                  key={String(col.key)}
                  style={{ textAlign: 'left', padding: '0.75rem', fontWeight: 600, cursor: 'pointer' }}
                  onClick={() => toggleSort(String(col.key))}
                >
                  {col.label} {sort === col.key && (order === 'asc' ? '↑' : '↓')}
                </th>
              ))}
              <th style={{ width: 120, padding: '0.75rem' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr><td colSpan={columns.length + 1} style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--text-secondary)' }}>No records</td></tr>
            ) : (
              items.map((row) => (
                <tr key={getRowKey(row)} style={{ borderBottom: '1px solid var(--border)' }}>
                  {columns.map((col) => (
                    <td key={String(col.key)} style={{ padding: '0.75rem' }}>
                      {col.render ? col.render(row) : String((row as Record<string, unknown>)[col.key as string] ?? '')}
                    </td>
                  ))}
                  <td style={{ padding: '0.75rem' }}>
                    <button type="button" onClick={() => onEdit(row)} style={{ marginRight: '0.5rem' }}>Edit</button>
                    <button type="button" onClick={() => setDeleteConfirm({ id: row.ID })}>Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {pages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', borderTop: '1px solid var(--border)' }}>
            <span style={{ fontSize: '0.875rem' }}>Total: {total}</span>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button type="button" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Prev</button>
              <span style={{ alignSelf: 'center' }}>Page {page} of {pages}</span>
              <button type="button" disabled={page >= pages} onClick={() => setPage((p) => p + 1)}>Next</button>
            </div>
          </div>
        )}
      </div>

      {deleteConfirm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>
          <div className="glass-panel" style={{ padding: '1.5rem', minWidth: 280 }}>
            <p>Delete this record?</p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1rem' }}>
              <button type="button" onClick={() => setDeleteConfirm(null)}>Cancel</button>
              <button type="button" onClick={handleDelete} style={{ background: '#dc2626', color: 'white' }}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
