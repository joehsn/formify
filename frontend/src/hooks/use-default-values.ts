import { FieldType } from '@/types';
import { useMemo } from 'react';

/**
 * A custom hook to use default values for form fields.
 * @param fields - The fields to use default values for.
 * @returns The default values for the fields.
 */
function useDefaultValues(fields: FieldType[]) {
  return useMemo(() => {
    const defaultValues: Record<string, string | string[] | undefined> = {};

    fields.forEach((field) => {
      if (field.type === 'checkbox') {
        defaultValues[field._id] = [];
      } else {
        defaultValues[field._id] = field.type === 'radio' ? undefined : '';
      }
    });

    return defaultValues;
  }, [fields]);
}

export default useDefaultValues;
