import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import axios, { AxiosError } from 'axios';
import { z, ZodTypeAny } from 'zod';
import { envSchema } from './schemas/';
import { FieldType } from '@/types';

/**
 * A utility function to merge Tailwind CSS classes with other classes.
 * @param inputs - The classes to merge.
 * @returns The merged classes.
 * @example
 * ```tsx
 * import { cn } from "./utils"
 *
 * const className = cn("text-red-500", "bg-blue-500", "p-4", "rounded-lg")
 * // => "text-red-500 bg-blue-500 p-4 rounded-lg"
 * ```
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * A utility function to fetch data using SWR.
 * @param url - The URL to fetch data from.
 * @returns The fetched data.
 * @see https://swr.vercel.app/docs/data-fetching
 */
export async function fetcher(url: string, method: 'GET' | 'POST' = 'GET') {
  try {
    const validUrl = z
      .string({
        required_error: 'A URL is required.',
      })
      .url('A valid URL is required.')
      .parse(url);
    const response = await axios({
      method,
      url: validUrl,
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error(error.errors);
    } else if (error instanceof AxiosError) {
      console.error(error.response?.data.message);
    } else {
      console.error(error);
    }
  }
}

/**
 * The environment variables for the application.
 */
export const envVars = envSchema.parse(import.meta.env);

/**
 * A utility function to generate a schema for the form.
 * @param fields - The fields of the form.
 * @returns The generated schema.
 */
export const generateSchema = (fields: FieldType[]) => {
  const schemaObject: Record<string, ZodTypeAny> = {};

  /**
   * A utility function to create an enum.
   * @param options - The options for the enum.
   * @returns The created enum.
   * @throws An error if the options are empty.
   */
  const createEnum = (options: string[] | undefined) => {
    if (!options || options.length === 0) {
      throw new Error('Options for enum must be a non-empty array of strings');
    }
    return z.enum([options[0], ...options.slice(1)]);
  };

  /**
   * A utility function to create a string schema.
   * @param field - The field to create the schema for.
   * @returns The created string schema.
   * @throws An error if the field is required and empty.
   */
  const createStringSchema = (field: FieldType) => {
    let str = z.string();
    if (field.fieldRequired) {
      str = str.nonempty(`${field.fieldLabel} is required`);
    }
    return str;
  };

  fields.forEach((field) => {
    const { fieldType, _id, fieldOptions, fieldRequired, fieldValidations } = field;

    switch (fieldType) {
      case 'radio':
      case 'dropdown':
        schemaObject[_id] = createEnum(fieldOptions);
        break;

      case 'checkbox':
        schemaObject[_id] = createEnum(fieldOptions).array().min(1);
        break;

      case 'date':
        schemaObject[_id] = z.date().transform((date) => date.toISOString());
        break;

      case 'email':
        schemaObject[_id] = createStringSchema(field).email(
          'Must be a valid email'
        );
        break;

      case 'number':
        schemaObject[_id] = createStringSchema(field);
        break;

      case 'text': {
        let textSchema = createStringSchema(field);
        if (fieldValidations?.minLength) {
          textSchema = textSchema.min(
            fieldValidations.minLength,
            `Minimum ${fieldValidations.minLength} characters required`
          );
        }
        if (fieldValidations?.maxLength) {
          textSchema = textSchema.max(
            fieldValidations.maxLength,
            `Maximum ${fieldValidations.maxLength} characters allowed`
          );
        }
        if (fieldValidations?.pattern) {
          textSchema = textSchema.regex(
            new RegExp(fieldValidations.pattern),
            'Invalid format'
          );
        }
        schemaObject[_id] = textSchema;
        break;
      }
      default:
        schemaObject[_id] = z.any();
    }
    if (!fieldRequired) {
      schemaObject[_id] = schemaObject[_id].optional();
    }
  });

  return z.object(schemaObject);
};
