import { useState, useCallback } from 'react';
import { EntityTable, ColumnDef } from '../../components/admin/EntityTable';
import { EntityFormModal } from '../../components/admin/EntityFormModal';
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
      setForm({
        PanNo: r.PanNo ?? '',
        Parti: r.Parti ?? '',
        Address: r.Address ?? '',
        Email: (r as Record<string, unknown>).Email as string ?? '',
        Contact_No: (r as Record<string, unknown>).Contact_No as string ?? '',
        FP: (r as Record<string, unknown>).FP as string ?? '',
        UserVat: (r as Record<string, unknown>).UserVat as string ?? '',
        PassVat: (r as Record<string, unknown>).PassVat as string ?? '',
        Mtax: (r as Record<string, unknown>).Mtax as string ?? '',
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
      <EntityFormModal open={modalOpen} title={editing ? 'Edit Parti' : 'Create Parti'} onClose={() => setModalOpen(false)}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <label>Pan No <input value={form.PanNo} onChange={(e) => setForm((f) => ({ ...f, PanNo: e.target.value }))} style={{ width: '100%', padding: '0.35rem' }} /></label>
          <label>Parti <input value={form.Parti} onChange={(e) => setForm((f) => ({ ...f, Parti: e.target.value }))} style={{ width: '100%', padding: '0.35rem' }} /></label>
          <label>Address <input value={form.Address} onChange={(e) => setForm((f) => ({ ...f, Address: e.target.value }))} style={{ width: '100%', padding: '0.35rem' }} /></label>
          <label>Email <input value={form.Email} onChange={(e) => setForm((f) => ({ ...f, Email: e.target.value }))} style={{ width: '100%', padding: '0.35rem' }} /></label>
          <label>Contact No <input value={form.Contact_No} onChange={(e) => setForm((f) => ({ ...f, Contact_No: e.target.value }))} style={{ width: '100%', padding: '0.35rem' }} /></label>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.5rem' }}>
            <button type="button" onClick={() => setModalOpen(false)}>Cancel</button>
            <button type="button" onClick={submit}>Save</button>
          </div>
        </div>
      </EntityFormModal>
    </>
  );
}

