import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isSlugValid(slug: string) {
  slug = slug.toLowerCase();

  // check if slug contains invalid characters
  if (!slug.match(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)) {
    return false;
  }

  return true;
}
