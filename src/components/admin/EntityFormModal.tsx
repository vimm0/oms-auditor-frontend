import { ReactNode } from 'react';

interface EntityFormModalProps {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
}

export function EntityFormModal({ open, title, onClose, children }: EntityFormModalProps) {
  if (!open) return null;
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10,
      }}
      onClick={onClose}
    >
      <div
        className="glass-panel"
        style={{ padding: '1.5rem', minWidth: 320, maxWidth: 480, maxHeight: '90vh', overflow: 'auto' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 style={{ margin: 0 }}>{title}</h3>
          <button type="button" onClick={onClose}>×</button>
        </div>
        {children}
      </div>
    </div>
  );
}
