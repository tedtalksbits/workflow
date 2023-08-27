import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const dTFns = {
  toLocalDateTime(date: Date | undefined | null) {
    if (!date) return null;
    return new Date(date.getTime() - date.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16);
  },

  isInThePast(date: Date | undefined | null) {
    if (!date) return false;
    return date.getTime() < Date.now();
  },
};
