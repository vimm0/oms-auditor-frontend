import { ReactNode } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Tooltip,
} from '@mui/material';
import { X, RotateCcw, Check } from 'lucide-react';

interface EntityFormModalProps {
  open: boolean;
  title: string;
  onClose: () => void;
  onSubmit?: () => void | Promise<void>;
  submitLabel?: string;
  children: ReactNode;
}

export function EntityFormModal({
  open,
  title,
  onClose,
  onSubmit,
  submitLabel = 'Save',
  children,
}: EntityFormModalProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 2 } }}>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pr: 1 }}>
        {title}
        <IconButton size="small" onClick={onClose} aria-label="Close">
          <X size={20} />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers sx={{ display: 'flex', flexDirection: 'column', gap: 2, minHeight: 120 }}>
        {children}
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Tooltip title="Cancel">
          <IconButton onClick={onClose} aria-label="Cancel">
            <RotateCcw size={20} />
          </IconButton>
        </Tooltip>
        {onSubmit && (
          <Tooltip title={submitLabel}>
            <IconButton color="primary" onClick={onSubmit} aria-label={submitLabel} sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', '&:hover': { bgcolor: 'primary.dark' } }}>
              <Check size={20} />
            </IconButton>
          </Tooltip>
        )}
      </DialogActions>
    </Dialog>
  );
}
