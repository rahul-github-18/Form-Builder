import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  TextField,
  Checkbox,
  FormControlLabel,
  Stack,
  Typography,
  Card,
  CardContent,
  Box,
  MenuItem,
  RadioGroup,
  Radio,
  FormLabel,
  FormControl,
  FormHelperText,
  Button,
  Alert,
} from '@mui/material';
import { RootState } from '../store';

function PreviewForm() {
  const fields = useSelector((state: RootState) => state.forms.currentForm);
  const [formValues, setFormValues] = useState<any>({});
  const [errors, setErrors] = useState<any>({});
  const [submittedFieldIds, setSubmittedFieldIds] = useState<string[]>([]);

  useEffect(() => {
    const initialValues: any = {};
    fields.forEach((field) => {
      initialValues[field.id] = field.defaultValue || '';
    });
    setFormValues(initialValues);
  }, [fields]);

  useEffect(() => {
    fields.forEach((field) => {
      if (field.type === 'derived' && field.derived) {
        const { formula, parents } = field.derived;
        const parentValues = parents.map((pid: string) => formValues[pid]);
        try {
          const computed = eval(
            formula.replace(/\b([a-zA-Z]\w*)\b/g, (match) => {
              const parentIndex = parents.indexOf(match);
              return parentIndex !== -1 ? parentValues[parentIndex] : match;
            })
          );
          setFormValues((prev: any) => ({ ...prev, [field.id]: computed }));
        } catch (e) {
          console.error('Derived field computation error:', e);
        }
      }
    });
  }, [formValues, fields]);

  const validateField = (field: any, value: any) => {
    const v = field.validation;
    if (!v) return '';
    if (field.required && !value) return `${field.label} is required`;
    if (v.minLength && value.length < v.minLength) return `Min length is ${v.minLength}`;
    if (v.maxLength && value.length > v.maxLength) return `Max length is ${v.maxLength}`;
    if (v.email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value)) return `Invalid email format`;
    if (v.passwordRule && !/^(?=.*\d).{8,}$/.test(value)) return `Password must be 8+ chars with a number`;
    return '';
  };

  const handleChange = (id: string, value: any) => {
    setFormValues((prev: any) => ({ ...prev, [id]: value }));
    const field = fields.find((f) => f.id === id);
    if (field) {
      const errorMsg = validateField(field, value);
      setErrors((prev: any) => ({ ...prev, [id]: errorMsg }));
    }
  };

  const handleSubmit = (id: string) => {
    const field = fields.find((f) => f.id === id);
    if (field) {
      const errorMsg = validateField(field, formValues[id]);
      if (!errorMsg) {
        setSubmittedFieldIds((prev) => [...prev, id]);
      } else {
        setErrors((prev: any) => ({ ...prev, [id]: errorMsg }));
      }
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'text': return '✍️';
      case 'number': return '🔢';
      case 'date': return '📅';
      case 'select': return '🔽';
      case 'radio': return '🔘';
      case 'checkbox': return '☑️';
      case 'textarea': return '📄';
      case 'derived': return '➗';
      default: return '❓';
    }
  };

  return (
    <Box p={{ xs: 1, md: 2 }}>
      <Typography variant="h5" fontWeight={700} gutterBottom>
        👁️ Preview Form
      </Typography>

      {fields.length === 0 ? (
        <Typography>No fields added yet. Use the form builder to add fields.</Typography>
      ) : (
        <Stack spacing={1.5}>
          {fields.map((field) => (
            <Card key={field.id} elevation={1} sx={{ borderRadius: 2 }}>
              <CardContent sx={{ py: 1.5, px: 2 }}>
                <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                  {getIcon(field.type)} {field.label} {field.required && '*'}
                </Typography>

                {/* Render Input Field */}
                {['text', 'number', 'date'].includes(field.type) && (
                  <TextField
                    size="small"
                    fullWidth
                    type={field.type}
                    required={field.required}
                    value={formValues[field.id] || ''}
                    onChange={(e) => handleChange(field.id, e.target.value)}
                    error={!!errors[field.id]}
                    helperText={errors[field.id] || getValidationHint(field)}
                    sx={{ mb: 1 }}
                  />
                )}

                {field.type === 'textarea' && (
                  <TextField
                    size="small"
                    multiline
                    rows={3}
                    fullWidth
                    required={field.required}
                    value={formValues[field.id] || ''}
                    onChange={(e) => handleChange(field.id, e.target.value)}
                    error={!!errors[field.id]}
                    helperText={errors[field.id] || getValidationHint(field)}
                    sx={{ mb: 1 }}
                  />
                )}

                {field.type === 'select' && field.options && (
                  <TextField
                    size="small"
                    select
                    fullWidth
                    required={field.required}
                    value={formValues[field.id] || ''}
                    onChange={(e) => handleChange(field.id, e.target.value)}
                    error={!!errors[field.id]}
                    helperText={errors[field.id] || `Select ${field.label}`}
                    sx={{ mb: 1 }}
                  >
                    {field.options.map((option, idx) => (
                      <MenuItem key={idx} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </TextField>
                )}

                {field.type === 'radio' && field.options && (
                  <FormControl required={field.required} error={!!errors[field.id]} sx={{ mb: 1 }} size="small">
                    <FormLabel>{field.label}</FormLabel>
                    <RadioGroup
                      row
                      value={formValues[field.id] || ''}
                      onChange={(e) => handleChange(field.id, e.target.value)}
                    >
                      {field.options.map((option, idx) => (
                        <FormControlLabel key={idx} value={option} control={<Radio size="small" />} label={option} />
                      ))}
                    </RadioGroup>
                    <FormHelperText>{errors[field.id] || getValidationHint(field)}</FormHelperText>
                  </FormControl>
                )}

                {field.type === 'checkbox' && (
                  <FormControlLabel
                    control={
                      <Checkbox
                        size="small"
                        checked={!!formValues[field.id]}
                        onChange={(e) => handleChange(field.id, e.target.checked)}
                      />
                    }
                    label={field.label}
                  />
                )}

                {field.type === 'derived' && (
                  <TextField
                    size="small"
                    fullWidth
                    disabled
                    value={formValues[field.id] || ''}
                    helperText={`➗ Formula: ${field.derived?.formula}`}
                    sx={{ mb: 1, backgroundColor: '#f5f5f5' }}
                  />
                )}

                {!['text', 'number', 'date', 'textarea', 'select', 'radio', 'checkbox', 'derived'].includes(field.type) && (
                  <TextField
                    size="small"
                    fullWidth
                    disabled
                    value={`[${field.type} field not implemented]`}
                    helperText="Coming soon"
                    sx={{ mb: 1 }}
                  />
                )}

                <Box display="flex" justifyContent="flex-end" alignItems="center" mt={1}>
                  <Button
                    variant="contained"
                    size="small"
                    color="primary"
                    onClick={() => handleSubmit(field.id)}
                    endIcon={<span>🚀</span>}
                  >
                    Submit
                  </Button>
                </Box>

                {submittedFieldIds.includes(field.id) && (
                  <Alert severity="success" sx={{ mt: 1, fontSize: '0.875rem' }}>
                    🎉 "{field.label}" submitted successfully!
                  </Alert>
                )}
              </CardContent>
            </Card>
          ))}
        </Stack>
      )}
    </Box>
  );
}

function getValidationHint(field: any): string | undefined {
  const v = field.validation;
  if (!v) return;

  const hints = [];
  if (v.minLength) hints.push(`Min length: ${v.minLength}`);
  if (v.maxLength) hints.push(`Max length: ${v.maxLength}`);
  if (v.email) hints.push(`Valid email required`);
  if (v.passwordRule) hints.push(`Password: 8+ chars & number`);

  return hints.length ? hints.join(' | ') : undefined;
}

export default PreviewForm;
