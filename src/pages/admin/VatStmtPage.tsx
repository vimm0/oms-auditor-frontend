import { useState, useCallback } from 'react';
import { EntityTable, ColumnDef } from '../../components/admin/EntityTable';
import { EntityFormModal } from '../../components/admin/EntityFormModal';
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
      <EntityFormModal open={modalOpen} title={editing ? 'Edit' : 'Create'} onClose={() => setModalOpen(false)}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <label>Fiscal Year <input value={form.Fiscalyear} onChange={(e) => setForm((f) => ({ ...f, Fiscalyear: e.target.value }))} style={{ width: '100%', padding: '0.35rem' }} /></label>
          <label>Months <input value={form.Months} onChange={(e) => setForm((f) => ({ ...f, Months: e.target.value }))} style={{ width: '100%', padding: '0.35rem' }} /></label>
          <label>Parti <input value={form.Parti} onChange={(e) => setForm((f) => ({ ...f, Parti: e.target.value }))} style={{ width: '100%', padding: '0.35rem' }} /></label>
          <label>Payable <input type="number" value={form.Payable} onChange={(e) => setForm((f) => ({ ...f, Payable: Number(e.target.value) || 0 }))} style={{ width: '100%', padding: '0.35rem' }} /></label>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.5rem' }}><button type="button" onClick={() => setModalOpen(false)}>Cancel</button><button type="button" onClick={submit}>Save</button></div>
        </div>
      </EntityFormModal>
    </>
  );
}
