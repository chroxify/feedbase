import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isSlugValid(slug: string) {
  // check if slug contains invalid characters
  if (!(/^[a-z0-9]+(?:-[a-z0-9]+)*$/.exec(slug.toLowerCase()))) {
    return false;
  }

  return true;
}
