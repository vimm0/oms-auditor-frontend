import { useState, useCallback } from 'react';
import { EntityTable, ColumnDef } from '../../components/admin/EntityTable';
import { EntityFormModal } from '../../components/admin/EntityFormModal';
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
      <EntityFormModal open={modalOpen} title={editing ? 'Edit' : 'Create'} onClose={() => setModalOpen(false)}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <label>User <input value={form.UserName} onChange={(e) => setForm((f) => ({ ...f, UserName: e.target.value }))} style={{ width: '100%', padding: '0.35rem' }} /></label>
          <label>Date <input value={form.LoginoutDate} onChange={(e) => setForm((f) => ({ ...f, LoginoutDate: e.target.value }))} style={{ width: '100%', padding: '0.35rem' }} /></label>
          <label>Remarks <input value={form.Remarks} onChange={(e) => setForm((f) => ({ ...f, Remarks: e.target.value }))} style={{ width: '100%', padding: '0.35rem' }} /></label>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.5rem' }}><button type="button" onClick={() => setModalOpen(false)}>Cancel</button><button type="button" onClick={submit}>Save</button></div>
        </div>
      </EntityFormModal>
    </>
  );
}
