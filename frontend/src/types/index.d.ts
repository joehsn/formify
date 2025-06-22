export interface User {
  _id: string;
  fullname: string;
  email: string;
}

export interface FieldType {
  _id: string;
  fieldLabel: string;
  fieldType:
  | 'text'
  | 'email'
  | 'number'
  | 'radio'
  | 'checkbox'
  | 'dropdown'
  | 'date';
  fieldOptions?: string[];
  fieldRequired: boolean;
  fieldValidations?: {
    maxLength?: number;
    minLength?: number;
    pattern?: string;
  };
}

export interface FormType {
  _id: string;
  formTitle: string;
  formDesc: string;
  formFields: FieldType[];
  formStatus: 'draft' | 'published' | 'closed';
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
