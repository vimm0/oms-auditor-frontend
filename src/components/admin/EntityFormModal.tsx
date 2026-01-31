import { ReactNode } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
} from '@mui/material';
import { X } from 'lucide-react';

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
        <Button onClick={onClose}>Cancel</Button>
        {onSubmit && (
          <Button variant="contained" onClick={onSubmit}>
            {submitLabel}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
