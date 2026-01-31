import { useState, useCallback } from 'react';
import { EntityTable, ColumnDef } from '../../components/admin/EntityTable';
import { EntityFormModal } from '../../components/admin/EntityFormModal';
import { apiPost, apiPatch } from '../../lib/api';

interface Row {
  ID: number;
  parti: string | null;
  year: string | null;
  Transaction: number | null;
  taxpayable: number | null;
  created_at: string | null;
}

const BASE = '/api/admin/ver-files';
const columns: ColumnDef<Row>[] = [
  { key: 'ID', label: 'ID' },
  { key: 'parti', label: 'Parti' },
  { key: 'year', label: 'Year' },
  { key: 'Transaction', label: 'Transaction' },
  { key: 'taxpayable', label: 'Tax Payable' },
  { key: 'created_at', label: 'Created' },
];

export default function VerFilesPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Row | null>(null);
  const [form, setForm] = useState({ parti: '', year: '', Transaction: 0, taxpayable: 0 });
  const [refetch, setRefetch] = useState(0);

  const openCreate = () => { setEditing(null); setForm({ parti: '', year: '', Transaction: 0, taxpayable: 0 }); setModalOpen(true); };
  const openEdit = useCallback((row: Row) => { setEditing(row); setForm({ parti: row.parti ?? '', year: row.year ?? '', Transaction: row.Transaction ?? 0, taxpayable: row.taxpayable ?? 0 }); setModalOpen(true); }, []);

  const submit = async () => {
    try {
      const body = { ...form, Transaction: Number(form.Transaction), taxpayable: Number(form.taxpayable) };
      if (editing) await apiPatch(`${BASE}/${editing.ID}`, body);
      else await apiPost(BASE, body);
      setModalOpen(false);
      setRefetch((r) => r + 1);
    } catch (e) { alert(e instanceof Error ? e.message : 'Failed'); }
  };

  return (
    <>
      <EntityTable<Row> key={refetch} title="Ver Files" basePath={BASE} columns={columns} onAdd={openCreate} onEdit={openEdit} getRowKey={(r) => r.ID} />
      <EntityFormModal open={modalOpen} title={editing ? 'Edit' : 'Create'} onClose={() => setModalOpen(false)}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <label>Parti <input value={form.parti} onChange={(e) => setForm((f) => ({ ...f, parti: e.target.value }))} style={{ width: '100%', padding: '0.35rem' }} /></label>
          <label>Year <input value={form.year} onChange={(e) => setForm((f) => ({ ...f, year: e.target.value }))} style={{ width: '100%', padding: '0.35rem' }} /></label>
          <label>Transaction <input type="number" value={form.Transaction} onChange={(e) => setForm((f) => ({ ...f, Transaction: Number(e.target.value) || 0 }))} style={{ width: '100%', padding: '0.35rem' }} /></label>
          <label>Tax Payable <input type="number" value={form.taxpayable} onChange={(e) => setForm((f) => ({ ...f, taxpayable: Number(e.target.value) || 0 }))} style={{ width: '100%', padding: '0.35rem' }} /></label>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.5rem' }}><button type="button" onClick={() => setModalOpen(false)}>Cancel</button><button type="button" onClick={submit}>Save</button></div>
        </div>
      </EntityFormModal>
    </>
  );
}
