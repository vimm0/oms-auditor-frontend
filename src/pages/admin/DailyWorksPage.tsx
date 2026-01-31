import { useState, useCallback } from 'react';
import { EntityTable, ColumnDef } from '../../components/admin/EntityTable';
import { EntityFormModal } from '../../components/admin/EntityFormModal';
import { apiPost, apiPatch } from '../../lib/api';

interface Row {
  ID: number;
  PanNo: string | null;
  PartiName: string | null;
  User: string | null;
  worktype: string | null;
  work: string | null;
  created_at: string | null;
}

const BASE = '/api/admin/daily-works';
const columns: ColumnDef<Row>[] = [
  { key: 'PanNo', label: 'Pan No' },
  { key: 'PartiName', label: 'Parti Name' },
  { key: 'User', label: 'User' },
  { key: 'worktype', label: 'Type' },
  { key: 'work', label: 'Work' },
  { key: 'created_at', label: 'Created' },
];

export default function DailyWorksPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Row | null>(null);
  const [form, setForm] = useState({ PanNo: '', PartiName: '', User: '', worktype: '', work: '', Remarks: '' });
  const [refetch, setRefetch] = useState(0);

  const openCreate = () => { setEditing(null); setForm({ PanNo: '', PartiName: '', User: '', worktype: '', work: '', Remarks: '' }); setModalOpen(true); };
  const openEdit = useCallback((row: Row) => { setEditing(row); setForm({ PanNo: row.PanNo ?? '', PartiName: row.PartiName ?? '', User: row.User ?? '', worktype: row.worktype ?? '', work: (row as Record<string, unknown>).work as string ?? '', Remarks: (row as Record<string, unknown>).Remarks as string ?? '' }); setModalOpen(true); }, []);

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
      <EntityTable<Row> key={refetch} title="Daily Works" basePath={BASE} columns={columns} onAdd={openCreate} onEdit={openEdit} getRowKey={(r) => r.ID} />
      <EntityFormModal open={modalOpen} title={editing ? 'Edit' : 'Create'} onClose={() => setModalOpen(false)}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <label>Pan No <input value={form.PanNo} onChange={(e) => setForm((f) => ({ ...f, PanNo: e.target.value }))} style={{ width: '100%', padding: '0.35rem' }} /></label>
          <label>Parti Name <input value={form.PartiName} onChange={(e) => setForm((f) => ({ ...f, PartiName: e.target.value }))} style={{ width: '100%', padding: '0.35rem' }} /></label>
          <label>User <input value={form.User} onChange={(e) => setForm((f) => ({ ...f, User: e.target.value }))} style={{ width: '100%', padding: '0.35rem' }} /></label>
          <label>Type <input value={form.worktype} onChange={(e) => setForm((f) => ({ ...f, worktype: e.target.value }))} style={{ width: '100%', padding: '0.35rem' }} /></label>
          <label>Work <input value={form.work} onChange={(e) => setForm((f) => ({ ...f, work: e.target.value }))} style={{ width: '100%', padding: '0.35rem' }} /></label>
          <label>Remarks <input value={form.Remarks} onChange={(e) => setForm((f) => ({ ...f, Remarks: e.target.value }))} style={{ width: '100%', padding: '0.35rem' }} /></label>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.5rem' }}><button type="button" onClick={() => setModalOpen(false)}>Cancel</button><button type="button" onClick={submit}>Save</button></div>
        </div>
      </EntityFormModal>
    </>
  );
}
