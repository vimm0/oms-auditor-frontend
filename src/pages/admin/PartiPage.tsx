import { useState, useCallback } from 'react';
import { EntityTable, ColumnDef } from '../../components/admin/EntityTable';
import { EntityFormModal } from '../../components/admin/EntityFormModal';
import { TextField, Box } from '@mui/material';
import { apiGet, apiPost, apiPatch } from '../../lib/api';

interface PartiRow {
  ID: number;
  PanNo: string | null;
  Parti: string | null;
  Address: string | null;
  created_at: string | null;
}

const BASE = '/api/admin/parti';
const columns: ColumnDef<PartiRow>[] = [
  { key: 'PanNo', label: 'Pan No' },
  { key: 'Parti', label: 'Parti' },
  { key: 'Address', label: 'Address' },
  { key: 'created_at', label: 'Created' },
];

const emptyForm = { PanNo: '', Parti: '', Address: '', Email: '', Contact_No: '', FP: '', UserVat: '', PassVat: '', Mtax: '' };

export default function PartiPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<PartiRow | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [refetch, setRefetch] = useState(0);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = useCallback((row: PartiRow) => {
    setEditing(row);
    apiGet<PartiRow>(`${BASE}/${row.ID}`).then((r) => {
      const rec = r as unknown as Record<string, unknown>;
      setForm({
        PanNo: r.PanNo ?? '',
        Parti: r.Parti ?? '',
        Address: r.Address ?? '',
        Email: (rec.Email as string) ?? '',
        Contact_No: (rec.Contact_No as string) ?? '',
        FP: (rec.FP as string) ?? '',
        UserVat: (rec.UserVat as string) ?? '',
        PassVat: (rec.PassVat as string) ?? '',
        Mtax: (rec.Mtax as string) ?? '',
      });
    }).catch(() => {});
    setModalOpen(true);
  }, []);

  const submit = async () => {
    try {
      const body = { ...form };
      if (editing) await apiPatch(`${BASE}/${editing.ID}`, body);
      else await apiPost(BASE, body);
      setModalOpen(false);
      setRefetch((r) => r + 1);
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Failed');
    }
  };

  return (
    <>
      <EntityTable<PartiRow>
        key={refetch}
        title="Parti"
        basePath={BASE}
        columns={columns}
        onAdd={openCreate}
        onEdit={openEdit}
        getRowKey={(r) => r.ID}
      />
      <EntityFormModal open={modalOpen} title={editing ? 'Edit Parti' : 'Create Parti'} onClose={() => setModalOpen(false)} onSubmit={submit}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField label="Pan No" value={form.PanNo} onChange={(e) => setForm((f) => ({ ...f, PanNo: e.target.value }))} size="small" fullWidth />
          <TextField label="Parti" value={form.Parti} onChange={(e) => setForm((f) => ({ ...f, Parti: e.target.value }))} size="small" fullWidth />
          <TextField label="Address" value={form.Address} onChange={(e) => setForm((f) => ({ ...f, Address: e.target.value }))} size="small" fullWidth />
          <TextField label="Email" value={form.Email} onChange={(e) => setForm((f) => ({ ...f, Email: e.target.value }))} size="small" fullWidth />
          <TextField label="Contact No" value={form.Contact_No} onChange={(e) => setForm((f) => ({ ...f, Contact_No: e.target.value }))} size="small" fullWidth />
        </Box>
      </EntityFormModal>
    </>
  );
}

