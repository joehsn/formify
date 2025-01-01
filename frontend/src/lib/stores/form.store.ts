import { create } from 'zustand';
import { produce } from 'immer';
import { v4 as uuid } from 'uuid';
import { FormType } from '../schemas/form.schema';

export interface State {
  form: FormType;
}

export interface Actions {
  setForm: (form: State['form']) => void;
  setFormTitle: (title: string) => void;
  setFormDescription: (description: string) => void;
  setFormStatus: (status: FormType['status']) => void;
  addFormField: () => void;
}

const useFormStore = create<State & Actions>((set) => ({
  form: {
    title: 'Untitled Form',
    description: '',
    fields: [
      {
        fieldId: uuid(),
        label: 'Untitled Field',
        type: 'text',
        required: false,
      },
    ],
    status: 'draft',
  },
  setForm: (form) => set({ form }),
  setFormTitle: (title) =>
    set(
      produce((state: State) => {
        state.form.title = title;
      })
    ),
  setFormDescription: (description) =>
    set(
      produce((state: State) => {
        state.form.description = description;
      })
    ),
  setFormStatus: (status) =>
    set(
      produce((state: State) => {
        state.form.status = status;
      })
    ),
  addFormField: () =>
    set(
      produce((state: State) => {
        state.form.fields.push({
          fieldId: uuid(),
          label: 'Untitled Field',
          type: 'text',
          required: false,
        });
      })
    ),
}));

export default useFormStore;
