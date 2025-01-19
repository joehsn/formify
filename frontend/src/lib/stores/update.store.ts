import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { FieldType, FormType } from '@/types';
import { defaultField } from '@/lib/utils';

interface State {
  form:
    | (FormType & {
        id: string;
      })
    | null;
}

interface Actions {
  setForm: (form: State['form']) => void;
  setFormTitle: (title: string) => void;
  setFormDescription: (description: string) => void;
  setFormStatus: (status: 'draft' | 'published' | 'closed') => void;
  setFields: (fields: FormType['fields']) => void;
  // For a fields
  setFieldLabel: (_id: string, label: string) => void;
  setFieldRequired: (_id: string, required: boolean) => void;
  setFieldType: (_id: string, type: FieldType['type']) => void;
  setFieldOptions: (_id: string, options: FieldType['options']) => void;
  setFieldValidations: (
    _id: string,
    validations: FieldType['validations']
  ) => void;
  addFormField: () => void;
  removeFormField: (_id: string) => void;
  // For a options
  setFieldOption: (_id: string, index: number, value: string) => void;
  addFieldOption: (_id: string) => void;
  removeFieldOption: (_id: string, index: number) => void;
}

const initialForm = JSON.parse(localStorage.getItem('form') || 'null');

const useUpdateFormStore = create<State & Actions>()(
  immer((set) => ({
    form: initialForm,
    setForm: (form) => {
      set((state) => {
        state.form = form;
      });
    },
    setFormTitle: (title) => {
      set((state) => {
        if (!state.form) {
          return;
        }
        state.form.title = title;
      });
    },
    setFormDescription: (description) => {
      set((state) => {
        if (!state.form) {
          return;
        }
        state.form.description = description;
      });
    },
    setFields: (fields) => {
      set((state) => {
        if (!state.form) {
          return;
        }
        state.form.fields = fields;
      });
    },
    setFieldLabel: (_id, label) => {
      set((state) => {
        if (!state.form) {
          return;
        }
        const index = state.form.fields.findIndex((f) => f._id === _id);
        state.form.fields[index].label = label;
      });
    },
    setFieldRequired: (_id, required) => {
      set((state) => {
        if (!state.form) {
          return;
        }
        const index = state.form.fields.findIndex((f) => f._id === _id);
        state.form.fields[index].required = required;
      });
    },
    setFieldType: (_id, type) => {
      set((state) => {
        if (!state.form) {
          return;
        }
        const index = state.form.fields.findIndex((f) => f._id === _id);
        state.form.fields[index].type = type;
        if (['radio', 'checkbox', 'dropdown'].includes(type)) {
          state.form.fields[index].options = state.form.fields[index]
            .options || ['', ''];
        } else {
          state.form.fields[index].options = [];
        }
      });
    },
    setFieldOptions: (_id, options) => {
      set((state) => {
        if (!state.form) {
          return;
        }
        const index = state.form.fields.findIndex((f) => f._id === _id);
        state.form.fields[index].options = options;
      });
    },
    setFieldValidations: (_id, validations) => {
      set((state) => {
        if (!state.form) {
          return;
        }
        const index = state.form.fields.findIndex((f) => f._id === _id);
        state.form.fields[index].validations = validations;
      });
    },
    addFormField: async () => {
      const field = await defaultField();
      set((state) => {
        if (!state.form) {
          return;
        }
        state.form.fields.push(field);
      });
    },
    removeFormField: (_id) => {
      set((state) => {
        if (!state.form) {
          return;
        }
        state.form.fields = state.form.fields.filter((f) => f._id !== _id);
      });
    },
    setFormStatus: (status) => {
      set((state) => {
        if (!state.form) {
          return;
        }
        state.form.status = status;
      });
    },
    setFieldOption: (_id, index, value) => {
      set((state) => {
        if (!state.form) {
          return;
        }
        const field = state.form.fields.find((f) => f._id === _id);
        if (field?.options) {
          field.options[index] = value;
        }
      });
    },
    addFieldOption: (_id) => {
      set((state) => {
        if (!state.form) {
          return;
        }
        const field = state.form.fields.find((f) => f._id === _id);
        if (field) {
          field.options?.push('');
        }
      });
    },
    removeFieldOption: (_id, index) => {
      set((state) => {
        if (!state.form) {
          return;
        }
        const field = state.form.fields.find((f) => f._id === _id);
        if (field) {
          field.options?.splice(index, 1);
        }
      });
    },
  }))
);

useUpdateFormStore.subscribe((state) => {
  document.title = `${state.form?.title} - Formify`;
});

export default useUpdateFormStore;
