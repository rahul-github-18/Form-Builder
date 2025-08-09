import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type FieldType = 'text' | 'number' | 'textarea' | 'select' | 'radio' | 'checkbox' | 'date' | 'derived' | 'type';

export interface FieldConfig {
  id: string;
  type: FieldType;
  label: string;
  required: boolean;
  defaultValue?: any;
  options?: string[];
  validation?: {
    minLength?: number;
    maxLength?: number;
    email?: boolean;
    passwordRule?: boolean;
  };
  derived?: {
    parents: string[];
    formula: string;
  };
}

interface FormState {
  currentForm: FieldConfig[];
  savedForms: { name: string; date: string; fields: FieldConfig[] }[];
}

const initialState: FormState = {
  currentForm: [],
  savedForms: JSON.parse(localStorage.getItem('savedForms') || '[]'),
};

const formSlice = createSlice({
  name: 'forms',
  initialState,
  reducers: {
    addField: (state, action: PayloadAction<FieldConfig>) => {
      state.currentForm.push(action.payload);
    },
    updateField: (state, action: PayloadAction<{ id: string; field: Partial<FieldConfig> }>) => {
      const idx = state.currentForm.findIndex(f => f.id === action.payload.id);
      if (idx !== -1) {
        state.currentForm[idx] = { ...state.currentForm[idx], ...action.payload.field };
      }
    },
    deleteField: (state, action: PayloadAction<string>) => {
      state.currentForm = state.currentForm.filter(f => f.id !== action.payload);
    },
    reorderFields: (state, action: PayloadAction<FieldConfig[]>) => {
      state.currentForm = action.payload;
    },
    saveForm: (state, action: PayloadAction<{ name: string }>) => {
      const newForm = {
        name: action.payload.name,
        date: new Date().toISOString(),
        fields: [...state.currentForm],
      };
      state.savedForms.push(newForm);
      localStorage.setItem('savedForms', JSON.stringify(state.savedForms));
    },
    clearCurrentForm: (state) => {
      state.currentForm = [];
    },
    deleteSavedForm: (state, action: PayloadAction<number>) => {
      state.savedForms.splice(action.payload, 1);
      localStorage.setItem('savedForms', JSON.stringify(state.savedForms));
    },
  },
});

export const {
  addField,
  updateField,
  deleteField,
  reorderFields,
  saveForm,
  clearCurrentForm,
  deleteSavedForm, // ✅ new export
} = formSlice.actions;

export default formSlice.reducer;
