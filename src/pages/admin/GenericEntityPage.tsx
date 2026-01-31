import { useState, useCallback } from 'react';
import { EntityTable, ColumnDef } from '../../components/admin/EntityTable';
import { EntityFormModal } from '../../components/admin/EntityFormModal';
import { apiGet, apiPost, apiPatch } from '../../lib/api';

interface GenericRow {
  ID: number;
  created_at?: string | null;
  updated_at?: string | null;
  [key: string]: unknown;
}

interface GenericEntityPageProps {
  title: string;
  basePath: string;
  columns?: ColumnDef<GenericRow>[];
}

const defaultColumns: ColumnDef<GenericRow>[] = [
  { key: 'created_at', label: 'Created' },
];

export default function GenericEntityPage({ title, basePath, columns = defaultColumns }: GenericEntityPageProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<GenericRow | null>(null);
  const [form, setForm] = useState<Record<string, string>>({});
  const [refetch, setRefetch] = useState(0);

  const openCreate = () => {
    setEditing(null);
    setForm({});
    setModalOpen(true);
  };

  const openEdit = useCallback((row: GenericRow) => {
    setEditing(row);
    apiGet<GenericRow>(`${basePath}/${row.ID}`)
      .then((r) => {
        const f: Record<string, string> = {};
        for (const k of Object.keys(r)) {
          if (k !== 'ID' && typeof (r as Record<string, unknown>)[k] !== 'object') {
            f[k] = String((r as Record<string, unknown>)[k] ?? '');
          }
        }
        setForm(f);
      })
      .catch(() => {});
    setModalOpen(true);
  }, [basePath]);

  const submit = async () => {
    try {
      const body = { ...form };
      if (editing) await apiPatch(`${basePath}/${editing.ID}`, body);
      else await apiPost(basePath, body);
      setModalOpen(false);
      setRefetch((r) => r + 1);
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Failed');
    }
  };

  return (
    <>
      <EntityTable<GenericRow>
        key={refetch}
        title={title}
        basePath={basePath}
        columns={columns}
        onAdd={openCreate}
        onEdit={openEdit}
        getRowKey={(r) => r.ID}
      />
      <EntityFormModal open={modalOpen} title={editing ? `Edit ${title}` : `Create ${title}`} onClose={() => setModalOpen(false)}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {Object.keys(form).length === 0 && !editing ? (
            <p style={{ color: 'var(--muted)' }}>No extra fields. Click Save to create with defaults.</p>
          ) : (
            Object.keys(form).map((key) => (
              <label key={key}>
                {key}{' '}
                <input
                  value={form[key] ?? ''}
                  onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                  style={{ width: '100%', padding: '0.35rem' }}
                />
              </label>
            ))
          )}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.5rem' }}>
            <button type="button" onClick={() => setModalOpen(false)}>Cancel</button>
            <button type="button" onClick={submit}>Save</button>
          </div>
        </div>
      </EntityFormModal>
    </>
  );
}
