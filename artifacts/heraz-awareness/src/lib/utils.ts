import { twMerge } from 'tailwind-merge';

import { clsx, type ClassValue } from 'clsx';

const arabicIndicDigits = '٠١٢٣٤٥٦٧٨٩';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function toArabicIndic(value: number | string) {
  return String(value).replace(/[0-9]/g, (digit) => arabicIndicDigits[Number(digit)]);
}
