import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import {
  Button, TextField, FormControlLabel, Checkbox, Stack,
  Typography, MenuItem, Dialog, DialogTitle,
  DialogContent, DialogActions, Divider, Box, Paper
} from '@mui/material';

import { addField, saveForm } from '../store/formSlice';
import { RootState } from '../store';
import { FieldType } from '../store/formSlice';

const fieldTypes: FieldType[] = ['text', 'number', 'textarea', 'select', 'radio', 'checkbox', 'date'];

const CreateForm: React.FC = () => {
  const dispatch = useDispatch();
  const form = useSelector((state: RootState) => state.forms.currentForm);

  const [label, setLabel] = useState('');
  const [type, setType] = useState<FieldType>('text');
  const [required, setRequired] = useState(false);
  const [defaultValue, setDefaultValue] = useState('');

  // Validation state (hidden in UI, retained in logic)
  const [minLength, setMinLength] = useState<number | ''>('');
  const [maxLength, setMaxLength] = useState<number | ''>('');
  const [email, setEmail] = useState(false);
  const [passwordRule, setPasswordRule] = useState(false);

  const [isDerived, setIsDerived] = useState(false);
  const [parentFields, setParentFields] = useState<string[]>([]);
  const [formula, setFormula] = useState('');

  const [formNameDialog, setFormNameDialog] = useState(false);
  const [formName, setFormName] = useState('');

  const handleAddField = () => {
    if (!label.trim()) return;

    dispatch(addField({
      id: uuidv4(),
      type,
      label,
      required,
      defaultValue,
      validation: {
        minLength: minLength || undefined,
        maxLength: maxLength || undefined,
        email,
        passwordRule,
      },
      derived: isDerived ? {
        parents: parentFields,
        formula,
      } : undefined,
    }));

    setLabel('');
    setType('text');
    setRequired(false);
    setDefaultValue('');
    setMinLength('');
    setMaxLength('');
    setEmail(false);
    setPasswordRule(false);
    setIsDerived(false);
    setParentFields([]);
    setFormula('');
  };

  const handleSave = () => {
    if (form.length === 0) return;
    setFormNameDialog(true);
  };

  const confirmSave = () => {
    if (!formName.trim()) return;
    dispatch(saveForm({ name: formName }));
    setFormName('');
    setFormNameDialog(false);
  };

  return (
    <Stack spacing={3} p={3}>
      <Typography variant="h4" fontWeight="bold" color="primary">✨ Dynamic Form Builder</Typography>
      <Divider />

      <Paper elevation={4} sx={{ p: 3, bgcolor: '#f5faff', border: '1px solid #90caf9', borderRadius: 2 }}>
        <Typography variant="h6" color="secondary" gutterBottom>🧩 Add New Field</Typography>

        <Stack spacing={2}>
          <TextField label="Label" value={label} onChange={(e) => setLabel(e.target.value)} fullWidth />
          <TextField select label="Type" value={type} onChange={(e) => setType(e.target.value as FieldType)} fullWidth>
            {fieldTypes.map(ft => <MenuItem key={ft} value={ft}>{ft}</MenuItem>)}
          </TextField>
          <TextField label="Default Value" value={defaultValue} onChange={(e) => setDefaultValue(e.target.value)} fullWidth />

          <FormControlLabel
            control={<Checkbox checked={required} onChange={(e) => setRequired(e.target.checked)} />}
            label="Required"
          />

          {/* Derived field logic */}
          <Divider sx={{ my: 2 }} />
          <Box sx={{ bgcolor: '#f5faff', p: 2, borderRadius: 1 }}>
            <FormControlLabel
              control={<Checkbox checked={isDerived} onChange={(e) => setIsDerived(e.target.checked)} />}
              label="Derived Field"
            />

            {isDerived && (
              <>
                <TextField
                  label="Parent Fields (comma separated)"
                  value={parentFields.join(',')}
                  onChange={(e) => setParentFields(e.target.value.split(',').map(v => v.trim()))}
                  fullWidth
                />
                <TextField
                  label="Formula / Logic"
                  value={formula}
                  onChange={(e) => setFormula(e.target.value)}
                  fullWidth
                />
              </>
            )}
          </Box>
        </Stack>

        <Box display="flex" justifyContent="space-between" alignItems="center" mt={3}>
          <Button variant="contained" color="primary" onClick={handleAddField}>➕ Add Field</Button>
          <Typography color="text.secondary">Fields Count: <b>{form.length}</b></Typography>
        </Box>
      </Paper>

      <Button
        variant="contained"
        color="success"
        sx={{ mt: 2, width: 'fit-content' }}
        onClick={handleSave}
        disabled={form.length === 0}
      >
        💾 Save Form
      </Button>

      {/* Save Form Dialog */}
      <Dialog open={formNameDialog} onClose={() => setFormNameDialog(false)}>
        <DialogTitle>💾 Save Form</DialogTitle>
        <DialogContent>
          <TextField
            label="Form Name"
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
            fullWidth
            autoFocus
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFormNameDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={confirmSave}>Save</Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
};

export default CreateForm;
