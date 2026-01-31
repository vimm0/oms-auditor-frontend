import { useState, useCallback } from 'react';
import { EntityTable, ColumnDef } from '../../components/admin/EntityTable';
import { EntityFormModal } from '../../components/admin/EntityFormModal';
import { apiPost, apiPatch } from '../../lib/api';

interface Row {
  ID: number;
  empid: number | null;
  Attdate: string | null;
  Nepdate: string | null;
  presentation: string | null;
  created_at: string | null;
}

const BASE = '/api/admin/attendance';
const columns: ColumnDef<Row>[] = [
  { key: 'ID', label: 'ID' },
  { key: 'empid', label: 'Emp ID' },
  { key: 'Attdate', label: 'Att Date' },
  { key: 'Nepdate', label: 'Nep Date' },
  { key: 'presentation', label: 'Present' },
  { key: 'created_at', label: 'Created' },
];

export default function AttendancePage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Row | null>(null);
  const [form, setForm] = useState({ empid: 0, Attdate: '', Nepdate: '', presentation: '' });
  const [refetch, setRefetch] = useState(0);

  const openCreate = () => { setEditing(null); setForm({ empid: 0, Attdate: '', Nepdate: '', presentation: '' }); setModalOpen(true); };
  const openEdit = useCallback((row: Row) => { setEditing(row); setForm({ empid: row.empid ?? 0, Attdate: row.Attdate ?? '', Nepdate: row.Nepdate ?? '', presentation: row.presentation ?? '' }); setModalOpen(true); }, []);

  const submit = async () => {
    try {
      const body = { ...form, empid: Number(form.empid) };
      if (editing) await apiPatch(`${BASE}/${editing.ID}`, body);
      else await apiPost(BASE, body);
      setModalOpen(false);
      setRefetch((r) => r + 1);
    } catch (e) { alert(e instanceof Error ? e.message : 'Failed'); }
  };

  return (
    <>
      <EntityTable<Row> key={refetch} title="Attendance" basePath={BASE} columns={columns} onAdd={openCreate} onEdit={openEdit} getRowKey={(r) => r.ID} />
      <EntityFormModal open={modalOpen} title={editing ? 'Edit' : 'Create'} onClose={() => setModalOpen(false)}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <label>Emp ID <input type="number" value={form.empid} onChange={(e) => setForm((f) => ({ ...f, empid: Number(e.target.value) || 0 }))} style={{ width: '100%', padding: '0.35rem' }} /></label>
          <label>Att Date <input value={form.Attdate} onChange={(e) => setForm((f) => ({ ...f, Attdate: e.target.value }))} style={{ width: '100%', padding: '0.35rem' }} /></label>
          <label>Nep Date <input value={form.Nepdate} onChange={(e) => setForm((f) => ({ ...f, Nepdate: e.target.value }))} style={{ width: '100%', padding: '0.35rem' }} /></label>
          <label>Present <input value={form.presentation} onChange={(e) => setForm((f) => ({ ...f, presentation: e.target.value }))} style={{ width: '100%', padding: '0.35rem' }} /></label>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.5rem' }}><button type="button" onClick={() => setModalOpen(false)}>Cancel</button><button type="button" onClick={submit}>Save</button></div>
        </div>
      </EntityFormModal>
    </>
  );
}
