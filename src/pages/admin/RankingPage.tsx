import { useState, useCallback } from 'react';
import { EntityTable, ColumnDef } from '../../components/admin/EntityTable';
import { EntityFormModal } from '../../components/admin/EntityFormModal';
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
  { key: 'ID', label: 'ID' },
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
      <EntityFormModal open={modalOpen} title={editing ? 'Edit' : 'Create'} onClose={() => setModalOpen(false)}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <label>Pan No <input value={form.PanNo} onChange={(e) => setForm((f) => ({ ...f, PanNo: e.target.value }))} style={{ width: '100%', padding: '0.35rem' }} /></label>
          <label>Fiscal Year <input value={form.Fiscalyear} onChange={(e) => setForm((f) => ({ ...f, Fiscalyear: e.target.value }))} style={{ width: '100%', padding: '0.35rem' }} /></label>
          <label>Total Sale <input type="number" value={form.ttlsale} onChange={(e) => setForm((f) => ({ ...f, ttlsale: Number(e.target.value) || 0 }))} style={{ width: '100%', padding: '0.35rem' }} /></label>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.5rem' }}><button type="button" onClick={() => setModalOpen(false)}>Cancel</button><button type="button" onClick={submit}>Save</button></div>
        </div>
      </EntityFormModal>
    </>
  );
}
