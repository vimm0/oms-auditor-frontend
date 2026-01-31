import { TextField, Box } from '@mui/material';

export type FieldType = 'text' | 'number' | 'password' | 'date';

export interface FormFieldConfig {
  name: string;
  label: string;
  type?: FieldType;
  placeholder?: string;
  fullWidth?: boolean;
}

interface EntityFormFieldsProps {
  fields: FormFieldConfig[];
  values: Record<string, string | number>;
  onChange: (name: string, value: string | number) => void;
  disabled?: boolean;
}

export function EntityFormFields({ fields, values, onChange, disabled }: EntityFormFieldsProps) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {fields.map(({ name, label, type = 'text', placeholder, fullWidth = true }) => (
        <TextField
          key={name}
          label={label}
          value={values[name] ?? ''}
          onChange={(e) => onChange(name, type === 'number' ? Number(e.target.value) || 0 : e.target.value)}
          type={type === 'date' ? 'date' : type}
          placeholder={placeholder}
          fullWidth={fullWidth}
          size="small"
          disabled={disabled}
          InputLabelProps={type === 'date' ? { shrink: true } : undefined}
        />
      ))}
    </Box>
  );
}
