import { useState, useCallback } from 'react';
import { EntityTable, ColumnDef } from '../../components/admin/EntityTable';
import { EntityFormModal } from '../../components/admin/EntityFormModal';
import { TextField, Box } from '@mui/material';
import { apiGet, apiPost, apiPatch } from '../../lib/api';

interface StaffDetailsRow {
  ID: number;
  sname: string | null;
  sright: string | null;
  Dressfine: number;
  created_at: string | null;
}

const BASE = '/api/admin/staff-details';
const columns: ColumnDef<StaffDetailsRow>[] = [
  { key: 'sname', label: 'Name' },
  { key: 'sright', label: 'Status' },
  { key: 'Dressfine', label: 'Dressfine' },
  { key: 'created_at', label: 'Created' },
];

export default function StaffDetailsPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<StaffDetailsRow | null>(null);
  const [form, setForm] = useState({ sname: '', spassword: '', sright: '', Dressfine: 0 });
  const [refetch, setRefetch] = useState(0);

  const openCreate = () => {
    setEditing(null);
    setForm({ sname: '', spassword: '', sright: '', Dressfine: 0 });
    setModalOpen(true);
  };

  const openEdit = useCallback((row: StaffDetailsRow) => {
    setEditing(row);
    setForm({
      sname: row.sname ?? '',
      spassword: '',
      sright: row.sright ?? '',
      Dressfine: row.Dressfine ?? 0,
    });
    setModalOpen(true);
  }, []);

  const submit = async () => {
    try {
      const body = { ...form, Dressfine: Number(form.Dressfine) };
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
      <EntityTable<StaffDetailsRow>
        key={refetch}
        title="Staff Details"
        basePath={BASE}
        columns={columns}
        onAdd={openCreate}
        onEdit={openEdit}
        getRowKey={(r) => r.ID}
      />
      <EntityFormModal open={modalOpen} title={editing ? 'Edit Staff' : 'Create Staff'} onClose={() => setModalOpen(false)} onSubmit={submit}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField label="Name" value={form.sname} onChange={(e) => setForm((f) => ({ ...f, sname: e.target.value }))} size="small" fullWidth />
          <TextField label="Password" type="password" value={form.spassword} onChange={(e) => setForm((f) => ({ ...f, spassword: e.target.value }))} size="small" fullWidth placeholder={editing ? 'Leave blank to keep' : ''} />
          <TextField label="Role" value={form.sright} onChange={(e) => setForm((f) => ({ ...f, sright: e.target.value }))} size="small" fullWidth placeholder="admin, account, Manager" />
          <TextField label="Dressfine" type="number" value={form.Dressfine} onChange={(e) => setForm((f) => ({ ...f, Dressfine: Number(e.target.value) || 0 }))} size="small" fullWidth inputProps={{ min: 0 }} />
        </Box>
      </EntityFormModal>
    </>
  );
}
