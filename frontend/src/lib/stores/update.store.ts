import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { FieldType, FormType } from '@/types';
import { v4 as uuidv4 } from "uuid"

interface Actions {
  setForm: (form: FormType) => void;
  setFormTitle: (title: string) => void;
  setFormDescription: (description: string) => void;
  setFormStatus: (status: FormType["formStatus"]) => void;
  setFields: (fields: FormType['formFields']) => void;
  // For a fields
  setFieldLabel: (_id: string, label: string) => void;
  setFieldRequired: (_id: string, required: boolean) => void;
  setFieldType: (_id: string, type: FieldType['fieldType']) => void;
  setFieldOptions: (_id: string, options: FieldType['fieldOptions']) => void;
  setFieldValidations: (
    _id: string,
    validations: FieldType['fieldValidations']
  ) => void;
  addFormField: () => void;
  removeFormField: (_id: string) => void;
  // For a options
  setFieldOption: (_id: string, index: number, value: string) => void;
  addFieldOption: (_id: string) => void;
  removeFieldOption: (_id: string, index: number) => void;
}

const useUpdateFormStore = create<{ form: FormType | null } & Actions>()(
  immer((set) => ({
    form: null,
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
        state.form.formTitle = title;
      });
    },
    setFormDescription: (description) => {
      set((state) => {
        if (!state.form) {
          return;
        }
        state.form.formDesc = description;
      });
    },
    setFields: (fields) => {
      set((state) => {
        if (!state.form) {
          return;
        }
        state.form.formFields = fields;
      });
    },
    setFieldLabel: (_id, label) => {
      set((state) => {
        if (!state.form) {
          return;
        }
        const index = state.form.formFields.findIndex((f) => f._id === _id);
        state.form.formFields[index].fieldLabel = label;
      });
    },
    setFieldRequired: (_id, required) => {
      set((state) => {
        if (!state.form) {
          return;
        }
        const index = state.form.formFields.findIndex((f) => f._id === _id);
        state.form.formFields[index].fieldRequired = required;
      });
    },
    setFieldType: (_id, type) => {
      set((state) => {
        if (!state.form) {
          return;
        }
        const index = state.form.formFields.findIndex((f) => f._id === _id);
        state.form.formFields[index].fieldType = type;
        if (['radio', 'checkbox', 'dropdown'].includes(type)) {
          const currentOptions = state.form.formFields[index].fieldOptions;
          state.form.formFields[index].fieldOptions = currentOptions && currentOptions.length > 0 ? currentOptions : ['', ''];
        } else {
          state.form.formFields[index].fieldOptions = [];
        }
      });
    },
    setFieldOptions: (_id, options) => {
      set((state) => {
        if (!state.form) {
          return;
        }
        const index = state.form.formFields.findIndex((f) => f._id === _id);
        state.form.formFields[index].fieldOptions = options;
      });
    },
    setFieldValidations: (_id, validations) => {
      set((state) => {
        if (!state.form) {
          return;
        }
        const index = state.form.formFields.findIndex((f) => f._id === _id);
        state.form.formFields[index].fieldValidations = validations;
      });
    },
    addFormField: () => {
      set((state) => {
        if (!state.form) {
          return;
        }
        state.form.formFields.push({
          _id: uuidv4(),
          fieldLabel: 'Untitled Field',
          fieldType: 'text',
          fieldRequired: false,
        });
      });
    },
    removeFormField: (_id) => {
      set((state) => {
        if (!state.form) {
          return;
        }
        state.form.formFields = state.form.formFields.filter((f) => f._id !== _id);
      });
    },
    setFormStatus: (status) => {
      set((state) => {
        if (!state.form) {
          return;
        }
        state.form.formStatus = status;
      });
    },
    setFieldOption: (_id, index, value) => {
      set((state) => {
        if (!state.form) {
          return;
        }
        const field = state.form.formFields.find((f) => f._id === _id);
        if (field?.fieldOptions) {
          field.fieldOptions[index] = value;
        }
      });
    },
    addFieldOption: (_id) => {
      set((state) => {
        if (!state.form) {
          return;
        }
        const field = state.form.formFields.find((f) => f._id === _id);
        if (field) {
          field.fieldOptions?.push('');
        }
      });
    },
    removeFieldOption: (_id, index) => {
      set((state) => {
        if (!state.form) {
          return;
        }
        const field = state.form.formFields.find((f) => f._id === _id);
        if (field) {
          field.fieldOptions?.splice(index, 1);
        }
      });
    },
  }))
);

useUpdateFormStore.subscribe((state) => {
  document.title = `${state.form?.formTitle} - Formify`;
});

export default useUpdateFormStore;
