import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

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
