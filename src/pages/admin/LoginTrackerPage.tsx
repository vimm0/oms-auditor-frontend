import { useState, useCallback } from 'react';
import { EntityTable, ColumnDef } from '../../components/admin/EntityTable';
import { EntityFormModal } from '../../components/admin/EntityFormModal';
import { TextField, Box } from '@mui/material';
import { apiPost, apiPatch } from '../../lib/api';

interface Row {
  ID: number;
  UserName: string | null;
  LoginoutDate: string | null;
  LoginTime: string | null;
  Remarks: string | null;
  created_at: string | null;
}

const BASE = '/api/admin/login-tracker';
const columns: ColumnDef<Row>[] = [
  { key: 'UserName', label: 'User' },
  { key: 'LoginoutDate', label: 'Date' },
  { key: 'LoginTime', label: 'Login' },
  { key: 'Remarks', label: 'Remarks' },
  { key: 'created_at', label: 'Created' },
];

export default function LoginTrackerPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Row | null>(null);
  const [form, setForm] = useState({ UserName: '', LoginoutDate: '', Remarks: '' });
  const [refetch, setRefetch] = useState(0);

  const openCreate = () => { setEditing(null); setForm({ UserName: '', LoginoutDate: '', Remarks: '' }); setModalOpen(true); };
  const openEdit = useCallback((row: Row) => { setEditing(row); setForm({ UserName: row.UserName ?? '', LoginoutDate: row.LoginoutDate ?? '', Remarks: row.Remarks ?? '' }); setModalOpen(true); }, []);

  const submit = async () => {
    try {
      if (editing) await apiPatch(`${BASE}/${editing.ID}`, form);
      else await apiPost(BASE, form);
      setModalOpen(false);
      setRefetch((r) => r + 1);
    } catch (e) { alert(e instanceof Error ? e.message : 'Failed'); }
  };

  return (
    <>
      <EntityTable<Row> key={refetch} title="Login Tracker" basePath={BASE} columns={columns} onAdd={openCreate} onEdit={openEdit} getRowKey={(r) => r.ID} />
      <EntityFormModal open={modalOpen} title={editing ? 'Edit' : 'Create'} onClose={() => setModalOpen(false)} onSubmit={submit}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField label="User" value={form.UserName} onChange={(e) => setForm((f) => ({ ...f, UserName: e.target.value }))} size="small" fullWidth />
          <TextField label="Date" value={form.LoginoutDate} onChange={(e) => setForm((f) => ({ ...f, LoginoutDate: e.target.value }))} size="small" fullWidth />
          <TextField label="Remarks" value={form.Remarks} onChange={(e) => setForm((f) => ({ ...f, Remarks: e.target.value }))} size="small" fullWidth />
        </Box>
      </EntityFormModal>
    </>
  );
}
