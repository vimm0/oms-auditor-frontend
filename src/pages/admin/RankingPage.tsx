import { useState, useCallback } from 'react';
import { EntityTable, ColumnDef } from '../../components/admin/EntityTable';
import { EntityFormModal } from '../../components/admin/EntityFormModal';
import { TextField, Box } from '@mui/material';
import { apiPost, apiPatch } from '../../lib/api';

interface Row {
  ID: number;
  PanNo: string | null;
  Fiscalyear: string | null;
  ttlsale: number | null;
  created_at: string | null;
}

const BASE = '/api/admin/ranking';
const columns: ColumnDef<Row>[] = [
  { key: 'PanNo', label: 'Pan No' },
  { key: 'Fiscalyear', label: 'Fiscal Year' },
  { key: 'ttlsale', label: 'Total Sale' },
  { key: 'created_at', label: 'Created' },
];

export default function RankingPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Row | null>(null);
  const [form, setForm] = useState({ PanNo: '', Fiscalyear: '', ttlsale: 0 });
  const [refetch, setRefetch] = useState(0);

  const openCreate = () => { setEditing(null); setForm({ PanNo: '', Fiscalyear: '', ttlsale: 0 }); setModalOpen(true); };
  const openEdit = useCallback((row: Row) => { setEditing(row); setForm({ PanNo: row.PanNo ?? '', Fiscalyear: row.Fiscalyear ?? '', ttlsale: row.ttlsale ?? 0 }); setModalOpen(true); }, []);

  const submit = async () => {
    try {
      const body = { ...form, ttlsale: Number(form.ttlsale) };
      if (editing) await apiPatch(`${BASE}/${editing.ID}`, body);
      else await apiPost(BASE, body);
      setModalOpen(false);
      setRefetch((r) => r + 1);
    } catch (e) { alert(e instanceof Error ? e.message : 'Failed'); }
  };

  return (
    <>
      <EntityTable<Row> key={refetch} title="Ranking" basePath={BASE} columns={columns} onAdd={openCreate} onEdit={openEdit} getRowKey={(r) => r.ID} />
      <EntityFormModal open={modalOpen} title={editing ? 'Edit' : 'Create'} onClose={() => setModalOpen(false)} onSubmit={submit}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField label="Pan No" value={form.PanNo} onChange={(e) => setForm((f) => ({ ...f, PanNo: e.target.value }))} size="small" fullWidth />
          <TextField label="Fiscal Year" value={form.Fiscalyear} onChange={(e) => setForm((f) => ({ ...f, Fiscalyear: e.target.value }))} size="small" fullWidth />
          <TextField label="Total Sale" type="number" value={form.ttlsale} onChange={(e) => setForm((f) => ({ ...f, ttlsale: Number(e.target.value) || 0 }))} size="small" fullWidth inputProps={{ min: 0 }} />
        </Box>
      </EntityFormModal>
    </>
  );
}
