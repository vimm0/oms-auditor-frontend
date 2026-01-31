import { useState, useCallback } from 'react';
import { EntityTable, ColumnDef } from '../../components/admin/EntityTable';
import { EntityFormModal } from '../../components/admin/EntityFormModal';
import { TextField, Box } from '@mui/material';
import { apiPost, apiPatch } from '../../lib/api';

interface Row {
  ID: number;
  Fiscalyear: string | null;
  Months: string | null;
  Parti: string | null;
  Payable: number | null;
  created_at: string | null;
}

const BASE = '/api/admin/vat-stmt';
const columns: ColumnDef<Row>[] = [
  { key: 'Fiscalyear', label: 'Fiscal Year' },
  { key: 'Months', label: 'Months' },
  { key: 'Parti', label: 'Parti' },
  { key: 'Payable', label: 'Payable' },
  { key: 'created_at', label: 'Created' },
];

export default function VatStmtPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Row | null>(null);
  const [form, setForm] = useState({ Fiscalyear: '', Months: '', Parti: '', Payable: 0 });
  const [refetch, setRefetch] = useState(0);

  const openCreate = () => { setEditing(null); setForm({ Fiscalyear: '', Months: '', Parti: '', Payable: 0 }); setModalOpen(true); };
  const openEdit = useCallback((row: Row) => { setEditing(row); setForm({ Fiscalyear: row.Fiscalyear ?? '', Months: row.Months ?? '', Parti: row.Parti ?? '', Payable: row.Payable ?? 0 }); setModalOpen(true); }, []);

  const submit = async () => {
    try {
      const body = { ...form, Payable: Number(form.Payable) };
      if (editing) await apiPatch(`${BASE}/${editing.ID}`, body);
      else await apiPost(BASE, body);
      setModalOpen(false);
      setRefetch((r) => r + 1);
    } catch (e) { alert(e instanceof Error ? e.message : 'Failed'); }
  };

  return (
    <>
      <EntityTable<Row> key={refetch} title="VAT Statement" basePath={BASE} columns={columns} onAdd={openCreate} onEdit={openEdit} getRowKey={(r) => r.ID} />
      <EntityFormModal open={modalOpen} title={editing ? 'Edit' : 'Create'} onClose={() => setModalOpen(false)} onSubmit={submit}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField label="Fiscal Year" value={form.Fiscalyear} onChange={(e) => setForm((f) => ({ ...f, Fiscalyear: e.target.value }))} size="small" fullWidth />
          <TextField label="Months" value={form.Months} onChange={(e) => setForm((f) => ({ ...f, Months: e.target.value }))} size="small" fullWidth />
          <TextField label="Parti" value={form.Parti} onChange={(e) => setForm((f) => ({ ...f, Parti: e.target.value }))} size="small" fullWidth />
          <TextField label="Payable" type="number" value={form.Payable} onChange={(e) => setForm((f) => ({ ...f, Payable: Number(e.target.value) || 0 }))} size="small" fullWidth inputProps={{ min: 0 }} />
        </Box>
      </EntityFormModal>
    </>
  );
}
