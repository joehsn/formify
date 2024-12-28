import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import axios from 'axios';
import { z } from 'zod';
import { envSchema } from './schemas/env.schema';

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
    if (axios.isAxiosError(error)) {
      console.log(error.response?.data?.message || error.message);
    }
  }
}

/**
 * The environment variables for the application.
 */
export const envVars = envSchema.parse(import.meta.env);
