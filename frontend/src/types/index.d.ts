export interface User {
  _id: string;
  fullname: string;
  email: string;
}

export interface FieldType {
  _id: string;
  label: string;
  type:
    | 'text'
    | 'email'
    | 'number'
    | 'radio'
    | 'checkbox'
    | 'dropdown'
    | 'date';
  options?: string[];
  required: boolean;
  validations?: {
    maxLength?: number;
    minLength?: number;
    pattern?: string;
  };
}

export interface FormType {
  _id?: string;
  title: string;
  description?: string;
  fields: FieldType[];
  status: 'draft' | 'published' | 'closed';
  createdAt?: string;
  updatedAt?: string;
}

export interface ResponseType {
  _id: string;
  responseId: string;
  formId: string;
  email?: string;
  answers: Record<string, string | string[]>;
  createdAt: string;
  updatedAt: string;
}
